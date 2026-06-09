import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  protected cartService = inject(CartService);
  private notify = inject(NotifyService);
  private router = inject(Router);
  private authService = inject(AuthService);

  showCheckoutForm = false;

  paymentData = {
    nombreTarjeta: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    direccion: ''
  };

  ngOnInit() {
    // Validar sesión antes de cargar el carrito
    if (!this.authService.isLoggedIn()) {
      this.notify.show('Debes iniciar sesión para ver tu carrito 🔒', 'info');
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.loadCart();
  }

  incrementQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product_id, item.cantidad + 1).subscribe({
      error: (err) => {
        this.notify.show('Error al actualizar la cantidad', 'error');
        console.error(err);
      }
    });
  }

  decrementQuantity(item: CartItem) {
    if (item.cantidad <= 1) {
      this.removeFromCart(item);
    } else {
      this.cartService.updateQuantity(item.product_id, item.cantidad - 1).subscribe({
        error: (err) => {
          this.notify.show('Error al actualizar la cantidad', 'error');
          console.error(err);
        }
      });
    }
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item.product_id).subscribe({
      next: () => {
        this.notify.show(`${item.product?.nombre} eliminado del carrito`, 'info');
      },
      error: (err) => {
        this.notify.show('No se pudo eliminar el producto', 'error');
        console.error(err);
      }
    });
  }

  clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar tu carrito? 🛒')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.notify.show('Carrito vaciado con éxito', 'info');
        },
        error: (err) => {
          this.notify.show('No se pudo vaciar el carrito', 'error');
          console.error(err);
        }
      });
    }
  }

  startCheckout() {
    this.showCheckoutForm = true;
  }

  cancelCheckout() {
    this.showCheckoutForm = false;
  }

  processPayment() {
    if (!this.paymentData.nombreTarjeta || !this.paymentData.numeroTarjeta || !this.paymentData.fechaExpiracion || !this.paymentData.cvv || !this.paymentData.direccion) {
      this.notify.show('Por favor, completa todos los campos del formulario de pago ❌', 'error');
      return;
    }

    this.notify.show('Procesando pago... 💳', 'info');
    
    setTimeout(() => {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.notify.show('¡Pago aprobado y compra realizada con éxito! 🎉', 'success');
          this.showCheckoutForm = false;
          // Limpiar datos
          this.paymentData = {
            nombreTarjeta: '',
            numeroTarjeta: '',
            fechaExpiracion: '',
            cvv: '',
            direccion: ''
          };
        },
        error: (err) => {
          this.notify.show('Error al finalizar el pedido', 'error');
          console.error(err);
        }
      });
    }, 1500);
  }
}
