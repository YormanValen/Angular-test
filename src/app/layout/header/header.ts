import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../core/auth/auth-store';
import { CartStore } from '../../features/cart/cart-store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Los stores son singletons: el header y la página del carrito
  // comparten la MISMA instancia, así que el contador se actualiza solo.
  protected readonly cart = inject(CartStore);
  protected readonly auth = inject(AuthStore);
}
