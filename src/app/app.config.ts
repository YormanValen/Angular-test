import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth-interceptor';

// Configuración global de la app (reemplaza al antiguo AppModule).
// Cada provide*() activa una funcionalidad.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Sin Zone.js: Angular detecta cambios gracias a los signals y a los eventos del template.
    provideZonelessChangeDetection(),

    // withComponentInputBinding: params, query params y data de la ruta llegan como input()
    provideRouter(routes, withComponentInputBinding()),

    // HttpClient usando fetch() y con nuestro interceptor de autenticación
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    // NgRx Store clásico: store raíz vacío; cada feature registra su parte (provideState)
    provideStore(),
    provideEffects(),
    // Conecta con la extensión Redux DevTools del navegador
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
