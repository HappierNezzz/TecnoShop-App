import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  stock: number;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.API_URL, product, { headers });
  }
}
