import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartStore } from '../../cart/cart-store';
import { ProductCard } from '../product-card/product-card';
import { ProductsPageActions } from '../state/products.actions';
import { productsFeature } from '../state/products.feature';

// COMPONENTE CONTENEDOR ("smart"): sabe de dónde salen los datos (Store)
// y se los pasa a componentes presentacionales (ProductCard).
@Component({
  selector: 'app-product-list',
  // Componente standalone: importa directamente lo que usa su template.
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly store = inject(Store);
  protected readonly cart = inject(CartStore);

  // selectSignal convierte un selector de NgRx en un Signal de solo lectura.
  // En el template se leen llamándolos como función: products()
  protected readonly products = this.store.selectSignal(productsFeature.selectFilteredProducts);
  protected readonly categories = this.store.selectSignal(productsFeature.selectCategories);
  protected readonly loading = this.store.selectSignal(productsFeature.selectLoading);
  protected readonly error = this.store.selectSignal(productsFeature.selectError);
  protected readonly searchTerm = this.store.selectSignal(productsFeature.selectSearchTerm);
  protected readonly selectedCategory = this.store.selectSignal(
    productsFeature.selectSelectedCategory,
  );

  ngOnInit(): void {
    // El componente solo avisa "me abrí". El Effect decide cargar de la API.
    this.store.dispatch(ProductsPageActions.opened());
  }

  protected onSearch(term: string): void {
    this.store.dispatch(ProductsPageActions.searchChanged({ term }));
  }

  protected onCategory(category: string): void {
    this.store.dispatch(ProductsPageActions.categorySelected({ category: category || null }));
  }
}
