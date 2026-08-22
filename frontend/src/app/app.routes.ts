import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';

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
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/pages/not-found/not-found').then(m => m.NotFound)
  }
];
