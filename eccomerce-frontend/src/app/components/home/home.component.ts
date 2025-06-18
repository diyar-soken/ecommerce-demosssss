import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
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
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        alert('Prodotto aggiunto al carrello!');
      },
      error: (err) => {
        console.error('Error adding to cart', err);
      }
    });
  }
}
