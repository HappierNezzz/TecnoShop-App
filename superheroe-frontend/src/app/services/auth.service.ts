import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<{ nombre: string } | null>(null);
  private apiUrl = 'api/auth/login'; // Ajusta según tu ruta de backend

  constructor(private http: HttpClient) {
    // Al cargar la app, revisamos si ya hay un usuario en el localStorage
    const savedUser = localStorage.getItem('user_name');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      this.currentUser.set({ nombre: savedUser });
    }
  }

  // Llama a esto cuando el login sea exitoso
  setLoginData(nombre: string, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user_name', nombre);
    this.currentUser.set({ nombre }); // Actualiza el estado global
  }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((res: any) => {
        // Si el backend nos da un token, lo guardamos
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();
    this.currentUser.set(null); // Limpia el estado global
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}
