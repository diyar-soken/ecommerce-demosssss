import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { CheckoutService } from '../../services/checkout.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
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
    private authService: AuthService,
    private toastService: ToastService,
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
    this.total = this.cartItems.reduce((sum, item) => {
      const price = item.product?.price || item.productPrice || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        // Rimuove l’item dalla lista locale
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.calculateTotal();
        this.cartService.updateCartCount(this.cartItems);
        this.toastService.success('Prodotto rimosso dal carrello');
      },
      error: (err) => {
        console.error('Errore nella rimozione del item', err);
        this.toastService.error('Errore nella rimozione del prodotto');
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
    if (!this.authService.isLoggedIn()) {
      this.toastService.info('🔐 Per procedere al checkout devi prima accedere o registrarti!', 5000);
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/cart' } 
      });
      return;
    }
    
    if (this.cartItems.length === 0) {
      this.toastService.warning('Il carrello è vuoto');
      return;
    }
    
    this.router.navigate(['/checkout']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
