import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  orderConfirmed = false;
  isLoading = false;
  errorMessage = '';
  confirmedOrder: Order | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: (error) => {
        console.error('Errore nel caricamento del carrello:', error);
        this.errorMessage = 'Errore nel caricamento del carrello';
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => {
      const price = item.product?.price || item.productPrice || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  confirmOrder() {
    if (this.cartItems.length === 0) {
      this.errorMessage = 'Il carrello è vuoto';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.checkout().subscribe({
      next: (order) => {
        this.confirmedOrder = order;
        this.orderConfirmed = true;
        this.cartItems = []; // svuota il carrello locale
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nella conferma dell\'ordine:', error);
        this.errorMessage = 'Errore nella conferma dell\'ordine. Riprova.';
        this.isLoading = false;
      }
    });
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }
}