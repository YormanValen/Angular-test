import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../../core/api';
import { Product } from '../../../core/models/product';
import { CartStore } from '../../cart/cart-store';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  // El parámetro :id de la ruta llega como input() gracias a withComponentInputBinding()
  readonly id = input.required<string>();

  protected readonly cart = inject(CartStore);

  // httpResource (experimental en v20): petición HTTP reactiva basada en signals.
  // Cada vez que cambia id(), se vuelve a pedir el producto automáticamente.
  // Expone value(), isLoading(), error(), hasValue()... todos signals.
  // Alternativa más simple que NgRx para datos que solo usa una pantalla.
  protected readonly product = httpResource<Product>(() => `${API_URL}/products/${this.id()}`);
}
