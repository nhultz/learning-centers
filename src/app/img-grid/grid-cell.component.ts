import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Center } from '../core';

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrls: ['./grid-cell.component.css']
})
export class GridCellComponent {
  @Input()
  gridIndex: number;

  @Input()
  center: Center;

  @Output()
  pickImageClicked = new EventEmitter();

  constructor() {}

  pickImage() {
    this.pickImageClicked.emit(this.gridIndex);
  }
}
