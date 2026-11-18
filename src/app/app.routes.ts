import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin.guard';
export const routes: Routes = [

  {
    path: '',
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./features/home/home')
            .then(m => m.HomeComponent)
      },

      {
        path: 'services',
        loadComponent: () =>
          import('./features/services/service-list/service-list')
            .then(m => m.ServiceListComponent)
      },

      {
        path: 'services/:id',
        loadComponent: () =>
          import('./features/services/service-details/service-details')
            .then(m => m.ServiceDetailsComponent)
      },

      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about')
            .then(m => m.About)
      },

      {
        path: 'booking/:id',
        loadComponent: () =>
          import('./features/booking/appointment-booking/appointment-booking')
            .then(m => m.AppointmentBookingComponent)
      },

      {
        path: 'gallery',
        loadComponent: () =>
          import('./features/gallery/gallery')
            .then(m => m.GalleryComponent)
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact')
            .then(m => m.Contact)
      },

      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login')
            .then(m => m.LoginComponent)
      },

{
  path: 'register',
  loadComponent: () =>
    import('./features/auth/register/register')
      .then(m => m.RegisterComponent)
},

{
  path: 'profile',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/customer/profile/profile')
      .then(m => m.ProfileComponent)
},

{
  path: 'admin/dashboard',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./features/admin/dashboard/dashboard')
      .then(m => m.DashboardComponent)
},
{
  path: 'admin/customers/:id',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./features/admin/customer-details/customer-details')
      .then(m => m.CustomerDetailsComponent)
},
{
  path: 'admin/customers',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./features/admin/customers/customers')
      .then(m => m.CustomersComponent)
},
{
  path: 'admin/services',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./features/admin/services/service-list/service-list')
      .then(m => m.ServiceListComponent)
},
{
  path: 'admin/services/add',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./features/admin/services/add-service/add-service')
      .then(m => m.AddService)
},
{
  path: 'admin/services/edit/:id',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./features/admin/services/edit-service/edit-service')
      .then(m => m.EditService)
},

    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];