import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title: string;

  constructor() {
    if (environment.name === 'prod') {
      this.title = 'Learning Centers';
    } else {
      this.title = `Learning Centers (${environment.name})`;
    }
  }
}
