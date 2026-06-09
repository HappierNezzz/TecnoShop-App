// superheroe-frontend/src/app/pages/catalog/catalog.component.ts
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Servicios
import { ProductsService, Product } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';
import { NotifyService } from '../../services/notify.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  private productsService = inject(ProductsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotifyService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Catálogo de productos renderizado:', this.products);
      },
      error: (err: any) => {
        console.error('Error al cargar productos:', err);
        this.notify.show('Error al cargar el catálogo de productos ❌', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addToCart(product: Product) {
    // 1. Validamos si está logueado
    if (!this.authService.isLoggedIn()) {
      this.notify.show('¡Inicia sesión primero para comprar! 🔒', 'info');
      this.router.navigate(['/login']);
      return;
    }

    console.log('Añadiendo al carrito el producto con ID:', product.id);
    
    // 2. Si está logueado, procedemos con la petición
    this.cartService.addToCart(product.id!, 1).subscribe({
      next: () => {
        this.notify.show(`¡${product.nombre} añadido al carrito! 🛒`, 'success');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.notify.show('Tu sesión ha expirado. Por favor, inicia sesión de nuevo 🔒', 'error');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.notify.show('Error al añadir al carrito ❌', 'error');
          console.error('Error al añadir al carrito:', err);
        }
      }
    });
  }

  getProductColor(category: string): string {
    const c = category?.toLowerCase() || '';
    if (c.includes('celular') || c.includes('teléf') || c.includes('phone')) return 'rgba(155, 89, 182, 0.15)';
    if (c.includes('computa')) return 'rgba(0, 102, 255, 0.15)';
    if (c.includes('accesor')) return 'rgba(50, 50, 50, 0.15)';
    if (c.includes('monito')) return 'rgba(255, 204, 0, 0.15)';
    if (c.includes('audio')) return 'rgba(255, 0, 0, 0.15)';
    if (c.includes('mueb')) return 'rgba(0, 255, 0, 0.15)';
    return 'rgba(224, 122, 95, 0.15)';
  }
}
