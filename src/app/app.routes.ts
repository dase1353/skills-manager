import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'skills',
        loadComponent: () => import('./features/skills-list/skills-list.component').then(m => m.SkillsListComponent)
    },
    {
        path: 'skills/:name',
        loadComponent: () => import('./features/skill-detail/skill-detail.component').then(m => m.SkillDetailComponent)
    },
    {
        path: 'install',
        loadComponent: () => import('./features/marketplace/marketplace.component').then(m => m.MarketplaceComponent)
    },
    {
        path: 'help',
        loadComponent: () => import('./features/help/help.component').then(m => m.HelpComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
    }
];
