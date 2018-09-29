import { Component, ViewChild, ElementRef } from '@angular/core';
import { PickerService, SearchService, Center } from '../core';

import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.css']
})
export class GridContainerComponent {
  currentCenters: Center[] = new Array(6);
  selectedGridIdx: number;

  @ViewChild('search')
  searchElement: ElementRef;

  showSearch = false;

  searchTerm$ = new Subject<string>();
  searchSubScription: Subscription;
  searchResults: Center[];

  constructor(
    public pickerService: PickerService,
    public searchService: SearchService
  ) {}

  onPickImageClicked(gridIndex: number) {
    this.selectedGridIdx = gridIndex;
    this.showSearch = true;

    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    }, 0);

    this.searchSubScription = this.searchService
      .search(this.searchTerm$)
      .subscribe(results => (this.searchResults = results));
  }

  closeOverlay() {
    this.selectedGridIdx = null;
    this.showSearch = false;
    this.searchResults = [];
    this.searchSubScription.unsubscribe();
  }

  pick(center: Center) {
    this.currentCenters[this.selectedGridIdx] = center;
    this.closeOverlay();
  }
}
