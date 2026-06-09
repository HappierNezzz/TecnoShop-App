// src/app/pages/catalog/catalog.component.ts
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Servicios
import { HeroesService, Heroe } from '../../services/heroes.service';
import { AuthService } from '../../services/auth.service';
import { NotifyService } from '../../services/notify.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotifyService);
  private favService = inject(FavoritesService);

  heroes: Heroe[] = [];
  loading: boolean = true;

  constructor(private heroesService: HeroesService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes() {
    this.loading = true;
    this.heroesService.getCatalog().subscribe({
      next: (data: any) => {
        this.heroes = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Catálogo renderizado con @for:', this.heroes);
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleFavorite(heroe: any) {
    if (heroe.esFavorito) {
      // Si ya es favorito, lo eliminamos
      this.favService.removeFavorite(heroe.id).subscribe({
        next: () => {
          heroe.esFavorito = false;
          this.notify.show('Eliminado de favoritos', 'info');
          this.cdr.detectChanges();
        }
      });
    } else {
      // Si no es favorito, lo agregamos
      this.favService.addFavorite(heroe.id).subscribe({
        next: () => {
          heroe.esFavorito = true;
          this.notify.show('¡Añadido! ❤️', 'success');
          this.cdr.detectChanges();
        }
      });
    }
  }

  addToFavorites(heroes: any) {
    // 1. Validamos si está logueado
    if (!this.authService.isLoggedIn()) {
      this.notify.show('¡ALTO AHÍ! Inicia sesión primero 🔒', 'info');
      return;
    }

    console.log('Añadiendo a favoritos el héroe con ID:', heroes.id);
    // 2. Si está logueado, procedemos con la petición
    this.heroesService.addFavorite(heroes.id).subscribe({
      next: () => {
        // 1. Buscamos el índice del héroe en nuestro array principal
        const index = this.heroes.findIndex(h => h.id === heroes.id);
        if (index !== -1) {
          // 2. Creamos una copia del objeto y le añadimos/cambiamos la propiedad
          // Esto rompe la referencia antigua y obliga a Angular a redibujar
          this.heroes[index] = {
            ...this.heroes[index],
            esFavorito: true
          };
        }

        this.notify.show(`${heroes.nombre} añadido a tus favoritos ❤️`, 'success');
        heroes.esFavorite = true;
        this.cdr.detectChanges(); // esto hace que angular se de cuenta del cambio
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.notify.show('Tu sesión ha expirado. Por favor, inicia sesión de nuevo 🔒', 'error');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 400) {
          this.notify.show(`${heroes.nombre} ya está en tus favoritos ❗`, 'info');
        } else {
          this.notify.show('Error al añadir a favoritos ❌', 'error');
          console.error('Error al añadir a favoritos:', err);
        }
      }
    });
  }

  getHeroColor(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('superman')) return 'rgba(0, 102, 255, 0.4)';
    if (n.includes('batman')) return 'rgba(50, 50, 50, 0.5)';
    if (n.includes('wonder')) return 'rgba(255, 204, 0, 0.5)';
    if (n.includes('flash')) return 'rgba(255, 0, 0, 0.5)';
    if (n.includes('spider')) return 'rgba(255, 50, 50, 0.4)';
    if (n.includes('hulk')) return 'rgba(0, 255, 0, 0.4)';
    return 'rgba(224, 122, 95, 0.3)';
  }
}
