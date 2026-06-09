import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NotifyService } from './services/notify.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('TecnoShop');
  
  // Inyectamos los servicios
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);
  public notify = inject(NotifyService);

  isLoggedIn: boolean = false;
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.isLoggedIn = !!localStorage.getItem('token');
    
    // Configuración inicial de modo oscuro
    if (typeof window !== 'undefined') {
      const darkMode = localStorage.getItem('darkMode') === 'true';
      this.isDarkMode.set(darkMode);
      this.applyTheme(darkMode);
    }
  }

  ngOnInit() {
    // Si el usuario está logueado al iniciar, cargamos su carrito
    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart();
    }
  }

  toggleDarkMode() {
    const nextVal = !this.isDarkMode();
    this.isDarkMode.set(nextVal);
    localStorage.setItem('darkMode', String(nextVal));
    this.applyTheme(nextVal);
  }

  private applyTheme(dark: boolean) {
    if (typeof document !== 'undefined') {
      if (dark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.authService.logout();
    this.cartService.cartItems.set([]); // Limpiamos el estado local del carrito
    this.cartService.cartCount.set(0);
    this.cartService.cartTotal.set(0);
    this.router.navigate(['/login']);
  }
}
