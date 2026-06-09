import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  loading = true;

  private favService = inject(FavoritesService);
  private notify = inject(NotifyService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favService.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data.map(f => ({ ...f, esFavorito: true }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.notify.show('Debe loguearse para ver favoritos', 'info');
          this.router.navigate(['/login']);
          this.authService.logout();
        } else {
          this.notify.show('Error al cargar favoritos', 'error');
        }
        this.loading = false;
      }
    });
  }

  removeFromFavorites(heroe: any) {
    this.favService.removeFavorite(heroe.id).subscribe({
      next: () => {
        // Filtramos el array para quitarlo de la vista inmediatamente
        this.favorites = this.favorites.filter(h => h.id !== heroe.id);
        this.notify.show(`${heroe.nombre} eliminado de favoritos`, 'info');
        this.cdr.detectChanges();
      },
      error: () => this.notify.show('No se pudo eliminar', 'error')
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
