import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../core/api';
import { Product, ProductsResponse } from '../../core/models/product';

// Un servicio encapsula la comunicación con la API.
// providedIn: 'root' => una única instancia (singleton) para toda la app,
// y además es "tree-shakable": si nadie lo usa, no entra en el bundle.
@Injectable({ providedIn: 'root' })
export class ProductApi {
  // inject() es la forma moderna de pedir dependencias (en lugar del constructor).
  private readonly http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    // HttpClient devuelve un Observable "frío": la petición se hace
    // solo cuando alguien se suscribe (en nuestro caso, el Effect de NgRx).
    return this.http
      .get<ProductsResponse>(`${API_URL}/products?limit=40`)
      .pipe(map((response) => response.products));
  }
}
