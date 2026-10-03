import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product } from '../../../core/models/product';

// ACCIONES: describen "qué pasó" (eventos), no "qué hacer".
// createActionGroup genera un creador por evento:
//   'Search Changed' => ProductsPageActions.searchChanged({ term })
// El "source" aparece en Redux DevTools como "[Products Page] Search Changed".

// Eventos que dispara la UI
export const ProductsPageActions = createActionGroup({
  source: 'Products Page',
  events: {
    Opened: emptyProps(),
    'Search Changed': props<{ term: string }>(),
    'Category Selected': props<{ category: string | null }>(),
  },
});

// Eventos que dispara el Effect con el resultado de la API
export const ProductsApiActions = createActionGroup({
  source: 'Products API',
  events: {
    'Load Success': props<{ products: Product[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
