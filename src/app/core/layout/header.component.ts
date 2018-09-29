import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input()
  title: string;

  constructor() {}
}
