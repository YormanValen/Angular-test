import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store';

// INTERCEPTOR FUNCIONAL: se ejecuta en CADA petición de HttpClient.
// Si hay sesión, agrega el header Authorization con el token.
// Se registra en app.config.ts con withInterceptors([authInterceptor]).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).token();
  if (!token) return next(req);

  // Las peticiones son inmutables: hay que clonarlas para modificarlas.
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
