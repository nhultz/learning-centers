import lunr from "lunr";
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";

class SearchService {
  /**
   * Create a SearchService
   * @param {firebase.firestore} db - Firestore Instance
   * @param {firebase.storage} storage - Firebase Storage Instance
   * @param {lunr.index} idx - Lunr Index
   * @param {Map<string, Object>} centersByRef - A map to look up centers by name
   *    key: center.name
   *    value: complete center object
   */
  db;
  storage;
  idx;
  centersByRef;

  constructor(firebase) {
    this.db = firebase.firestore;
    this.storage = firebase.storage;

    this.centersByRef = new Map();
    this.buildIndex();
  }

  /**
   * Build an in-memory index with all documents from the 'center' collection
   * in Firebase Firestore.
   */
  buildIndex() {
    this.db
      .collection("centers")
      .get()
      .then(snapshot => this.createCenters(snapshot))
      .then(centers => this.createIndex(centers))
      .then(index => (this.idx = index));
  }

  /**
   * Map a firestore query snapshot to a list of centers.
   * @param {firestore.QuerySnapshot} fireStoreSnapshot
   */
  createCenters(fireStoreSnapshot) {
    var storage = this.storage;

    return fireStoreSnapshot.docs.map(doc => {
      const d = doc.data();
      return {
        ...d,
        urlPromise: storage.ref(d.storageUrl).getDownloadURL()
      };
    });
  }

  /**
   * Create an in-memory Lunr index.
   * @param {Array} centers
   */
  createIndex(centers) {
    var _this = this;
    return lunr(function() {
      this.ref("name");
      this.field("name");
      this.field("category");

      centers.forEach(c => {
        _this.centersByRef.set(c.name, c);
        this.add(c);
      });
    });
  }

  /**
   * Search the index with incoming terms
   * @param {Observable<string>} terms - words being typed
   * @returns {Observable<Array>} - The search results
   */
  search(terms) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(term => this.searchIdx(term))
    );
  }

  /**
   * Search Lunr Index with term
   * @param {string} query - incoming search term
   * @returns {Array} - The search results mapped to Center objects
   */
  searchIdx(query) {
    const queryWithWildcards = query
      .trim()
      .split(" ")
      .map(word => `${word}* ${word}`)
      .join(" ");

    return this.idx
      .search(queryWithWildcards)
      .map(result => this.centersByRef.get(result.ref));
  }
}

const fb = require("../firebase-config.js");
export default new SearchService(fb);
