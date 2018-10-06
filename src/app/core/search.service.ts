import { Injectable } from '@angular/core';
import { Center } from './models/center.model';

import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, take } from 'rxjs/operators';
import { Builder, Index } from 'lunr';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private centersByRef: Map<string, Center> = new Map();
  private idx: Index;

  constructor(
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
    const centersCollection = afStore.collection<Center>('centers');
    centersCollection
      .valueChanges()
      .pipe(
        take(1),
        map(col => this.transformStorageUrl(col))
      )
      .subscribe(col => this.buildIndex(col));
  }

  private transformStorageUrl(centers: Center[]): Center[] {
    return centers.map(c => {
      return {
        ...c,
        url: this.afStorage.ref(c.storageUrl).getDownloadURL()
      };
    });
  }

  private buildIndex(centers: Center[]) {
    const builder = new Builder();
    builder.ref('name');
    builder.field('name');
    builder.field('category');

    centers.forEach(c => {
      this.centersByRef.set(c.name, c);
      builder.add(c);
    });

    this.idx = builder.build();
  }

  search(terms: Observable<string>): Observable<Center[]> {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(term => this.searchIdx(term))
    );
  }

  searchIdx(query: string): Center[] {
    const queryWithWildcards = query
      .trim()
      .split(' ')
      .map(word => `${word}* ${word}`)
      .join(' ');

    return this.idx
      .search(queryWithWildcards)
      .map(result => this.centersByRef.get(result.ref));
  }
}
