import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'list', component: ListComponent},
      {path: 'create', component: CreateComponent},
      {path: 'edit/:id', component: CreateComponent},
      {path: '**', redirectTo: 'list'}
    ]
  }
];
