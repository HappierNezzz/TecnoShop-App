import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../../services/products.service';
import { NotifyService } from '../../services/notify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productData: Omit<Product, 'id'> = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen_url: '',
    stock: 10,
    categoria: 'Accesorios'
  };

  private productsService = inject(ProductsService);
  private notify = inject(NotifyService);
  private router = inject(Router);

  fileNameSelected: string = '';

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileNameSelected = file.name;
      this.productData.imagen_url = file.name;
    }
  }

  get fullImagePath(): string {
    const imageName = this.productData.imagen_url || 'Placeholder.png';
    return `assets/images/${imageName}`;
  }

  onSubmit() {
    this.productsService.createProduct(this.productData).subscribe({
      next: () => {
        this.notify.show(`¡${this.productData.nombre} registrado con éxito! 📦`, 'success');
        this.router.navigate(['/catalog']);
      },
      error: (err) => {
        this.notify.show('Error al registrar el producto. Revisa los datos.', 'error');
        console.error('Error al registrar producto:', err);
      }
    });
  }
}
