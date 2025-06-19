import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('✅ Prodotti ricevuti:', products);
        this.products = products;
      },
      error: (err: any) => {
        console.error('❌ Errore caricamento prodotti:', err);
      }

    });
  }


  addToCart(productId: number): void {
    // Trova il prodotto per ottenere le informazioni
    const product = this.products.find(p => p.id === productId);
    
    this.cartService.addToCart(
      productId,
      product?.name,
      product?.price,
      product?.imageUrl
    ).subscribe({
      next: () => {
        this.toastService.success(`✅ ${product?.name || 'Prodotto'} aggiunto al carrello! 🛒`, 4000);
      },
      error: (err) => {
        console.error('Errore aggiunta al carrello:', err);
        this.toastService.error('Errore nell\'aggiunta al carrello');
      }
    });
  }
}
