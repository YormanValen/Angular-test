import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { API_URL } from '../api';
import { Credentials, LoginResponse, User } from '../models/user';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = { user: null, token: null, loading: false, error: null };
const STORAGE_KEY = 'auth';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  // withState crea un signal por propiedad: user(), token(), loading(), error()
  withState(initialState),

  withComputed(({ token, user }) => ({
    isLoggedIn: computed(() => token() !== null),
    displayName: computed(() => (user() ? `${user()!.firstName} ${user()!.lastName}` : '')),
  })),

  // withMethods también puede inyectar dependencias (como un servicio)
  withMethods((store, http = inject(HttpClient), router = inject(Router)) => ({
    // rxMethod: método que recibe valores y los procesa con un pipe de RxJS.
    // Es el equivalente a un Effect del Store clásico, pero dentro del SignalStore.
    login: rxMethod<Credentials & { returnUrl: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        exhaustMap(({ returnUrl, ...credentials }) =>
          http.post<LoginResponse>(`${API_URL}/auth/login`, credentials).pipe(
            // tapResponse maneja next/error sin matar el stream
            tapResponse({
              next: ({ accessToken, refreshToken, ...user }) => {
                patchState(store, { user, token: accessToken, loading: false });
                router.navigateByUrl(returnUrl);
              },
              error: (err: HttpErrorResponse) =>
                patchState(store, {
                  loading: false,
                  error: err.status === 400 ? 'Usuario o contraseña incorrectos' : err.message,
                }),
            }),
          ),
        ),
      ),
    ),

    logout(): void {
      patchState(store, initialState);
      router.navigateByUrl('/login');
    },
  })),

  withHooks({
    onInit(store) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) patchState(store, JSON.parse(saved) as Pick<AuthState, 'user' | 'token'>);
      } catch {
        // sin sesión guardada
      }

      effect(() => {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ user: store.user(), token: store.token() }),
          );
        } catch {
          // ignorar
        }
      });
    },
  }),
);
