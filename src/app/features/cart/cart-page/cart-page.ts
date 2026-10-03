import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../core/auth/auth-store';
import { CartStore } from '../cart-store';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  protected readonly cart = inject(CartStore);
  protected readonly auth = inject(AuthStore);

  // Estado LOCAL del componente: un signal simple basta, no hace falta un store.
  protected readonly purchased = signal(false);

  protected checkout(): void {
    this.cart.clear();
    this.purchased.set(true);
  }
}
