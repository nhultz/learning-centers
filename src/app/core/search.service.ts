import { Injectable } from '@angular/core';
import { Center } from './models/center.model';

import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

import * as lunr from 'lunr';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private centers: Center[] = [
    {
      category: 'math',
      name: 'blocks',
      url: 'assets/img/science.png'
    },
    {
      category: 'math',
      name: 'shapes',
      url: 'assets/img/science.png'
    }
  ];

  private centersByRef: Map<string, Center> = new Map();
  private idx: lunr.Index;

  constructor() {
    const builder = new lunr.Builder();
    builder.ref('name');
    builder.field('name');
    builder.field('category');

    this.centers.forEach(c => {
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
