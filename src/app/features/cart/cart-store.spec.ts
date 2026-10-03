import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart-store';

describe('CartStore', () => {
  const phone = { id: 1, title: 'iPhone', price: 100, thumbnail: '' };
  const case_ = { id: 2, title: 'Funda', price: 15, thumbnail: '' };

  let store: InstanceType<typeof CartStore>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    store = TestBed.inject(CartStore);
  });

  it('agrega productos e incrementa la cantidad si ya existe', () => {
    store.add(phone);
    store.add(phone);
    store.add(case_);

    expect(store.entityMap()[1].quantity).toBe(2);
    expect(store.totalItems()).toBe(3);
    expect(store.totalPrice()).toBe(215);
  });

  it('decrementa y elimina el item cuando llega a 0', () => {
    store.add(phone);
    store.decrement(1);
    expect(store.entities()).toEqual([]);
  });

  it('vacía el carrito', () => {
    store.add(phone);
    store.add(case_);
    store.clear();
    expect(store.totalItems()).toBe(0);
  });
});
