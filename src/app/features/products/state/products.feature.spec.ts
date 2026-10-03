import { Product } from '../../../core/models/product';
import { ProductsApiActions, ProductsPageActions } from './products.actions';
import { productsFeature } from './products.feature';

// Reducers y selectores son funciones puras: se testean sin TestBed.
const product = (id: number, title: string, category: string): Product => ({
  id,
  title,
  category,
  description: '',
  price: 10,
  discountPercentage: 0,
  rating: 5,
  stock: 20,
  thumbnail: '',
  images: [],
});

describe('productsFeature', () => {
  const { reducer } = productsFeature;

  it('marca loading al abrir la página', () => {
    const state = reducer(undefined, ProductsPageActions.opened());
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('guarda los productos al cargar con éxito', () => {
    const loading = reducer(undefined, ProductsPageActions.opened());
    const state = reducer(
      loading,
      ProductsApiActions.loadSuccess({ products: [product(1, 'iPhone', 'smartphones')] }),
    );
    expect(state.loading).toBeFalse();
    expect(state.ids).toEqual([1]);
  });

  it('guarda el error si falla la carga', () => {
    const state = reducer(undefined, ProductsApiActions.loadFailure({ error: 'boom' }));
    expect(state.error).toBe('boom');
  });

  it('filtra por texto y categoría', () => {
    const products = [
      product(1, 'iPhone 9', 'smartphones'),
      product(2, 'Mascara', 'beauty'),
      product(3, 'iPhone X', 'smartphones'),
    ];
    // projector ejecuta solo la función final del selector con entradas dadas
    const select = productsFeature.selectFilteredProducts.projector;

    expect(select(products, 'iphone', null).map((p) => p.id)).toEqual([1, 3]);
    expect(select(products, '', 'beauty').map((p) => p.id)).toEqual([2]);
    expect(select(products, 'x', 'smartphones').map((p) => p.id)).toEqual([3]);
  });
});
