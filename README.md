# Angular Tienda — proyecto de estudio (Angular 20 + NgRx 20)

Mini e-commerce con la API pública [DummyJSON](https://dummyjson.com). Cubre:
componentes standalone, signals, control flow (`@if`/`@for`/`@let`), `input()`/`output()`,
servicios e inyección de dependencias, HttpClient, interceptors, routing con lazy loading,
guards, formularios reactivos, `httpResource`, modo zoneless, **NgRx Store clásico**
(acciones, reducer, selectores, effects, entity) y **NgRx SignalStore**.

## Cómo correrlo

Requisitos: Node 20.19+ o 22.12+.

```bash
npm install
npm start          # http://localhost:4200
npm test           # tests unitarios (Karma, necesita Chrome)
```

Login de prueba: `emilys` / `emilyspass`.

Instala la extensión **Redux DevTools** en el navegador para ver las acciones de NgRx.

## Orden sugerido de lectura

1. `src/main.ts` → `src/app/app.config.ts` → `src/app/app.routes.ts`
2. `core/models/` y `features/products/product-api.ts` (servicio + HttpClient)
3. `features/products/product-card/` (componente presentacional: input, output, computed)
4. `features/products/state/` (NgRx clásico: actions → feature/reducer → effects)
5. `features/products/product-list/` (conecta el Store con la UI)
6. `features/products/product-detail/` (`httpResource` + parámetro de ruta como input)
7. `features/cart/cart-store.ts` (NgRx SignalStore con entities)
8. `core/auth/` (SignalStore con `rxMethod`, interceptor y guard)
9. `features/auth/login/` (formulario reactivo tipado)
10. Los archivos `*.spec.ts` (tests de reducer, selectores y SignalStore)
