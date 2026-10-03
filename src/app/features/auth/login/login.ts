import { Component, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../core/auth/auth-store';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // withComponentInputBinding también enlaza query params: /login?returnUrl=/cart
  readonly returnUrl = input<string>();

  protected readonly auth = inject(AuthStore);
  private readonly fb = inject(NonNullableFormBuilder);

  // FORMULARIO REACTIVO TIPADO: el modelo del form vive en TypeScript, no en el HTML.
  // NonNullableFormBuilder => los valores son string (no string | null).
  // Valores precargados con el usuario de prueba de DummyJSON.
  protected readonly form = this.fb.group({
    username: ['emilys', [Validators.required, Validators.minLength(3)]],
    password: ['emilyspass', [Validators.required, Validators.minLength(6)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      // Muestra los errores de todos los campos
      this.form.markAllAsTouched();
      return;
    }
    // getRawValue() devuelve { username: string; password: string } tipado
    this.auth.login({ ...this.form.getRawValue(), returnUrl: this.returnUrl() ?? '/products' });
  }
}
