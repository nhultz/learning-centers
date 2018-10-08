import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UploadComponent } from './upload.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [UploadComponent]
})
export class ManagementModule {}
