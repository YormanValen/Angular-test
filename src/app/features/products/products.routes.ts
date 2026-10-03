import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import * as productsEffects from './state/products.effects';
import { productsFeature } from './state/products.feature';

// Rutas de la feature "products". Se cargan de forma diferida (lazy) desde app.routes.ts,
// así que este código, su estado y sus effects solo se descargan al entrar a /products.
export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    // El estado y los effects se registran a nivel de ruta (feature state).
    providers: [provideState(productsFeature), provideEffects(productsEffects)],
    children: [
      {
        path: '',
        loadComponent: () => import('./product-list/product-list').then((m) => m.ProductList),
      },
      {
        // :id llega al componente como input() gracias a withComponentInputBinding()
        path: ':id',
        loadComponent: () =>
          import('./product-detail/product-detail').then((m) => m.ProductDetail),
      },
    ],
  },
];
