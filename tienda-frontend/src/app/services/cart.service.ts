import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from './products.service';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  cantidad: number;
  product?: Product;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = '/api/cart';

  // Signals para estado reactivo del carrito
  cartItems = signal<CartItem[]>([]);
  cartCount = signal<number>(0);
  cartTotal = signal<number>(0);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  loadCart() {
    const token = localStorage.getItem('token');
    if (!token || token === '') {
      this.cartItems.set([]);
      this.cartCount.set(0);
      this.cartTotal.set(0);
      return;
    }

    this.http.get<CartItem[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (items) => {
        this.cartItems.set(items);
        this.updateTotals();
      },
      error: () => {
        this.cartItems.set([]);
        this.cartCount.set(0);
        this.cartTotal.set(0);
      }
    });
  }

  addToCart(productId: number, cantidad: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { productId, cantidad }, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadCart())
    );
  }

  updateQuantity(productId: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, { cantidad }, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadCart())
    );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadCart())
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, { headers: this.getHeaders() }).pipe(
      tap(() => {
        this.cartItems.set([]);
        this.cartCount.set(0);
        this.cartTotal.set(0);
      })
    );
  }

  private updateTotals() {
    const items = this.cartItems();
    const count = items.reduce((sum, item) => sum + item.cantidad, 0);
    const total = items.reduce((sum, item) => sum + (item.cantidad * (item.product?.precio || 0)), 0);
    this.cartCount.set(count);
    this.cartTotal.set(total);
  }
}
