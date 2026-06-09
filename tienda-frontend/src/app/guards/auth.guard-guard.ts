// src/app/guards/auth.guard-guard.ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotifyService } from '../services/notify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotifyService);

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Deja pasar al usuario
    } else {
      this.notify.show('¡Debes iniciar sesión para acceder a esta sección! 🔒', 'info');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
