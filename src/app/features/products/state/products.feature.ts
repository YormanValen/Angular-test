import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Product } from '../../../core/models/product';
import { ProductsApiActions, ProductsPageActions } from './products.actions';

// ESTADO: EntityState guarda la colección normalizada { ids: [], entities: {} }
// y le sumamos nuestros propios campos.
export interface ProductsState extends EntityState<Product> {
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string | null;
  sort: string | null;
}

// El adapter trae funciones para manipular la colección sin mutarla
// (setAll, addOne, updateOne, removeOne...) y selectores listos.
const adapter = createEntityAdapter<Product>();

const initialState: ProductsState = adapter.getInitialState({
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: null,
  sort: 'none'
});

// createFeature agrupa reducer + selectores. Por cada propiedad del estado
// genera un selector automático: selectLoading, selectError, selectSearchTerm...
export const productsFeature = createFeature({
  name: 'products',

  // REDUCER: función pura (estado, acción) => nuevo estado.
  // Nunca muta: siempre devuelve un objeto nuevo con spread (...).
  reducer: createReducer(
    initialState,
    on(ProductsPageActions.opened, (state) => ({ ...state, loading: true, error: null })),
    on(ProductsPageActions.searchChanged, (state, { term }) => ({ ...state, searchTerm: term })),
    on(ProductsPageActions.categorySelected, (state, { category }) => ({
      ...state,
      selectedCategory: category,
    })),
    on(ProductsPageActions.sortChanged, (state, {sort}) => ({ ...state, sort:sort })),

    on(ProductsApiActions.loadSuccess, (state, { products }) =>
      adapter.setAll(products, { ...state, loading: false }),
    ),
    on(ProductsApiActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),
    
  ),

  // SELECTORES DERIVADOS: se memorizan, solo se recalculan cuando cambian sus entradas.
  extraSelectors: ({ selectProductsState, selectSearchTerm, selectSelectedCategory, selectSort }) => {
    const { selectAll } = adapter.getSelectors(selectProductsState);

    const selectCategories = createSelector(selectAll, (products) => [
      ...new Set(products.map((p) => p.category)),
    ]);

    const selectFilteredProducts = createSelector(
      selectAll,
      selectSearchTerm,
      selectSelectedCategory,
      (products, term, category) => {
        const normalized = term.trim().toLowerCase();
        return products.filter(
          (p) =>
            (!category || p.category === category) &&
            (!normalized || p.title.toLowerCase().includes(normalized)),
        );
      },
    );

    const selectedSortedProducts = createSelector(
      selectFilteredProducts,
      selectSort,
      (products, sort) => {
        if(sort == 'asc'){
          return [...products].sort((a,b) => a.price - b.price)
        } else {
          return [...products].sort((a,b) => b.price - a.price)
        }
      }
    )

    return { selectAllProducts: selectAll, selectCategories, selectFilteredProducts, selectedSortedProducts };
  },
});
