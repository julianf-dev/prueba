import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<app-header></app-header>
            <router-outlet></router-outlet>
  `,
})
export class HomeComponent {

}
