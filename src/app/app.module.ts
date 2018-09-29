import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { ImgGridModule } from './img-grid/img-grid.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, AppRoutingModule, ImgGridModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
