import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { ProductApi } from '../product-api';
import { ProductsApiActions, ProductsPageActions } from './products.actions';

// EFFECTS: aquí viven los efectos secundarios (HTTP, localStorage, navegación...).
// Escuchan acciones, hacen trabajo asíncrono y emiten NUEVAS acciones.
// Así el reducer se mantiene puro.
//
// Flujo: [Products Page] Opened -> HTTP -> [Products API] Load Success | Load Failure
export const loadProducts = createEffect(
  (actions$ = inject(Actions), api = inject(ProductApi)) =>
    actions$.pipe(
      ofType(ProductsPageActions.opened),
      // exhaustMap ignora nuevos "Opened" mientras haya una petición en curso.
      // (switchMap cancelaría la anterior; concatMap las encolaría).
      exhaustMap(() =>
        api.getAll().pipe(
          map((products) => ProductsApiActions.loadSuccess({ products })),
          // catchError DENTRO del exhaustMap: si va afuera, el effect muere al primer error.
          catchError((error: HttpErrorResponse) =>
            of(ProductsApiActions.loadFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);
