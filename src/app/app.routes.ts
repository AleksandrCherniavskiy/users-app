import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: 'users',
  loadComponent: () => import('./users-page/users-page.component').then(m => m.UsersPageComponent),
}, {
  path: '**',
  redirectTo: 'users',
}];
