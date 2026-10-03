import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth-store';

// GUARD FUNCIONAL: decide si se puede entrar a una ruta.
// Devuelve true para permitir el paso, o un UrlTree para redirigir.
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthStore).isLoggedIn()) return true;

  // Redirige al login recordando a dónde quería ir el usuario.
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
