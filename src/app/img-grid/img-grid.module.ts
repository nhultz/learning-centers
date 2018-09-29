import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridContainerComponent } from './grid-container.component';
import { GridCellComponent } from './grid-cell.component';

@NgModule({
  imports: [CommonModule],
  declarations: [GridContainerComponent, GridCellComponent]
})
export class ImgGridModule {}
