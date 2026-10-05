import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product';

// COMPONENTE PRESENTACIONAL ("dumb"): no inyecta servicios ni stores.
// Solo recibe datos por input() y avisa eventos por output().
// Es fácil de reutilizar y de testear.
@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, DecimalPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  // input.required: el padre DEBE pasarlo, o falla en compilación.
  readonly product = input.required<Product>();
  // input con valor por defecto
  readonly quantityInCart = input(0);

  // output() reemplaza a @Output() + EventEmitter
  readonly addToCart = output<Product>();

  // computed: valor derivado de otros signals; se recalcula solo cuando cambian.
  protected readonly lowStock = computed(() => this.product().stock < 10);

  //computed para validar si tiene descuento 
  protected readonly hasDiscount = computed(() => this.product().discountPercentage > 10);

}
