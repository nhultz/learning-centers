import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { HeaderComponent } from './layout';
import { LoginComponent } from './auth';

@NgModule({
  imports: [CommonModule, AngularFireAuthModule, AngularFirestoreModule],
  declarations: [HeaderComponent, LoginComponent],
  exports: [HeaderComponent]
})
export class CoreModule {}
