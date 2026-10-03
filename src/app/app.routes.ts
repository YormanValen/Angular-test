import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    // LAZY LOADING de toda una feature: carga sus rutas (y su estado NgRx) bajo demanda
    loadChildren: () => import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: 'cart',
    // Ruta protegida: si no hay sesión, el guard redirige a /login
    canActivate: [authGuard],
    // LAZY LOADING de un solo componente
    loadComponent: () => import('./features/cart/cart-page/cart-page').then((m) => m.CartPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  // Cualquier otra URL
  { path: '**', redirectTo: 'products' },
];
