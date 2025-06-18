import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  cart: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Errore caricamento prodotti', err)
    });
    console.log('Prodotti ricevuti:', this.products);
  }

  onAddToCart(productId: number) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.cart.push(product);
    }
  }

  getCartTotal(): number {
    return this.cart.reduce((total, p) => total + (p.price || 0), 0);
  }
}
