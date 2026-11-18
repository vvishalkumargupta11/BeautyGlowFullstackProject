import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/dashboard',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/customers',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/customers/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/services',
    renderMode: RenderMode.Client
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client
  },
  {
    path: 'services/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'booking/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
