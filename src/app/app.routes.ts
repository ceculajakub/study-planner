import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/tasks/tasks.component').then(m => m.TasksComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'goals',
    loadComponent: () => import('./components/goals/goals.component').then(m => m.GoalsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'notes',
    loadComponent: () => import('./components/notes/notes.component').then(m => m.NotesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
