import { computed, effect } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods } from '@ngrx/signals';
import {
  addEntity,
  removeAllEntities,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { Product } from '../../core/models/product';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

// Lo mínimo que necesita el carrito. Tanto Product como CartItem cumplen este tipo.
type Purchasable = Pick<Product, 'id' | 'title' | 'price' | 'thumbnail'>;

const STORAGE_KEY = 'cart';

// NGRX SIGNALSTORE: el enfoque moderno de NgRx, basado en signals.
// Sin acciones ni reducers: el estado, los valores derivados y los métodos
// se componen con "features" (withState, withComputed, withMethods...).
// Compáralo con el Store clásico de products/state/.
export const CartStore = signalStore(
  // Singleton global, igual que un servicio con providedIn: 'root'
  { providedIn: 'root' },

  // withEntities agrega estado normalizado + signals: entities(), ids(), entityMap()
  withEntities<CartItem>(),

  // withComputed: valores derivados (signals de solo lectura)
  withComputed(({ entities }) => ({
    totalItems: computed(() => entities().reduce((sum, item) => sum + item.quantity, 0)),
    totalPrice: computed(() =>
      entities().reduce((sum, item) => sum + item.price * item.quantity, 0),
    ),
  })),

  // withMethods: la única forma de modificar el estado, usando patchState
  withMethods((store) => ({
    add(product: Purchasable): void {
      if (store.entityMap()[product.id]) {
        patchState(
          store,
          updateEntity({ id: product.id, changes: (item) => ({ quantity: item.quantity + 1 }) }),
        );
      } else {
        const { id, title, price, thumbnail } = product;
        patchState(store, addEntity({ id, title, price, thumbnail, quantity: 1 }));
      }
    },

    decrement(id: number): void {
      const item = store.entityMap()[id];
      if (!item) return;
      patchState(
        store,
        item.quantity > 1
          ? updateEntity({ id, changes: { quantity: item.quantity - 1 } })
          : removeEntity(id),
      );
    },

    remove(id: number): void {
      patchState(store, removeEntity(id));
    },

    clear(): void {
      patchState(store, removeAllEntities());
    },
  })),

  // withHooks: lógica al crear/destruir el store. Aquí persistimos en localStorage.
  withHooks({
    onInit(store) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) patchState(store, setAllEntities(JSON.parse(saved) as CartItem[]));
      } catch {
        // localStorage no disponible o datos corruptos: empezamos con el carrito vacío
      }

      // effect() se re-ejecuta cada vez que cambian los signals que lee (entities)
      effect(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(store.entities()));
        } catch {
          // ignorar
        }
      });
    },
  }),
);
