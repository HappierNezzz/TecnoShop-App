import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { AuthGuard } from './guards/auth.guard-guard';
import { UserRegistrationComponent } from './pages/user-registration/user-registration.component';
import { Login } from './pages/login/login';
import { CartComponent } from './pages/cart/cart.component';
import { AddProductComponent } from './pages/add-product/add-product.component';

export const routes: Routes = [
  { path: 'catalog', component: CatalogComponent },
  { path: 'user-registration', component: UserRegistrationComponent },
  { path: 'nuevo-producto', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'login', component: Login },
  { path: 'carrito', component: CartComponent, canActivate: [AuthGuard] },
  { path: '**', component: CatalogComponent },
];
