import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./features/vehicles/vehicle-list/vehicle-list').then(m => m.VehicleList),
  },
  {
    path: 'vehicles/add',
    loadComponent: () => import('./features/vehicles/vehicle-form/vehicle-form').then(m => m.VehicleForm),
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found').then(m => m.NotFound),
  }
];
