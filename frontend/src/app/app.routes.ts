import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'redirect'
  },
  {
    path: 'redirect',
    loadComponent: () =>
      import('./features/dashboard/redirect.component').then(m => m.RedirectComponent)
  },
  {
    path: 'master',
    loadComponent: () =>
      import('./features/dashboard/master-dashboard.component').then(m => m.MasterDashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: ['MASTER_MSSP'] }
  },
  {
    path: 'zone',
    loadComponent: () =>
      import('./features/dashboard/zone-dashboard.component').then(m => m.ZoneDashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: ['MSSP'] }
  },
  {
    path: 'area',
    loadComponent: () =>
      import('./features/dashboard/area-dashboard.component').then(m => m.AreaDashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: ['ENTERPRISE_TENANT'] }
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/dashboard/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/dashboard.component').then(m => m.ReportsDashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: [] }
  },
  { path: '**', redirectTo: 'redirect' }
];
