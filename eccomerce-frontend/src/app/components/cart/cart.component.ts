import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  shippingCost: number = 9

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Error loading cart', err);
      }
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        // Rimuove l’item dalla lista locale
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.total = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },
      error: (err) => {
        console.error('Errore nella rimozione dell\'item', err);
      }
    });
  }


  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartItems = [];
        this.total = 0;
      },
      error: (err) => {
        console.error('Error clearing cart', err);
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
