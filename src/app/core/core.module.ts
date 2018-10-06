import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './layout';
import { LoginComponent } from './auth';

@NgModule({
  imports: [CommonModule],
  declarations: [HeaderComponent, LoginComponent],
  exports: [HeaderComponent]
})
export class CoreModule {}
