import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
//import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { NotifyService } from './services/notify.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('superheroes App');
  // Inyectamos el servicio
  authService = inject(AuthService);
  private router = inject(Router);
  public notify = inject(NotifyService);

  // Podrías usar esto para cambiar el menú si el usuario está logueado
  isLoggedIn: boolean = false;
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Aquí podrías verificar si hay un token en el localStorage al iniciar
    this.isLoggedIn = !!localStorage.getItem('token');
    
    // Configuración inicial de modo oscuro
    if (typeof window !== 'undefined') {
      const darkMode = localStorage.getItem('darkMode') === 'true';
      this.isDarkMode.set(darkMode);
      this.applyTheme(darkMode);
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
    // Redirigir al login
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
