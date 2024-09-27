import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
            <section class="dark min-h-lvh h-lvh flex flex-col">
              <app-header  class="header"></app-header>
              <div class="dark:bg-slate-800 main py-4">
                <h1 class="mb-4 text-4xl text-white text-center">Tareas</h1>
                  <router-outlet></router-outlet>
              </div>
            </section>
  `,
})
export class HomeComponent {

}
