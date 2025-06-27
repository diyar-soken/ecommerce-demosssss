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

  updateQuantity(item: CartItem, event: any): void {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity < 1 || newQuantity > 99 || isNaN(newQuantity)) {
      // Ripristina il valore precedente se non valido
      event.target.value = item.quantity;
      return;
    }

    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        // Aggiorna l'item nella lista locale
        const index = this.cartItems.findIndex(i => i.id === item.id);
        if (index !== -1) {
          this.cartItems[index].quantity = newQuantity;
          this.calculateTotal();
          this.cartService.updateCartCount(this.cartItems);
        }
      },
      error: (err) => {
        console.error('Errore nell\'aggiornamento della quantità', err);
        this.toastService.error('Errore nell\'aggiornamento della quantità');
        // Ripristina il valore precedente
        event.target.value = item.quantity;
      }
    });
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity >= 99) {
      this.toastService.warning('Quantità massima raggiunta (99)');
      return;
    }
    
    const newQuantity = item.quantity + 1;
    console.log(`Incremento quantità: ${item.quantity} -> ${newQuantity} per item ${item.id}`);
    
    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        console.log('Incremento completato:', updatedItem);
        item.quantity = newQuantity;
        this.calculateTotal();
        this.cartService.updateCartCount(this.cartItems);
        this.toastService.success('Quantità aumentata');
      },
      error: (err) => {
        console.error('Errore nell\'incremento della quantità', err);
        
        // Se l'errore è dovuto al fatto che l'item non esiste nel carrello locale,
        // aggiorna direttamente l'item corrente e ricarica il carrello
        if (err.message === 'Item not found in local cart') {
          console.log('Item non trovato nel carrello locale, aggiornamento diretto');
          item.quantity = newQuantity;
          this.calculateTotal();
          this.toastService.warning('Carrello sincronizzato localmente');
        } else {
          this.toastService.error('Errore nell\'aggiornamento della quantità');
        }
      }
    });
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      this.toastService.warning('Quantità minima raggiunta (1)');
      return;
    }
    
    const newQuantity = item.quantity - 1;
    console.log(`Decremento quantità: ${item.quantity} -> ${newQuantity} per item ${item.id}`);
    
    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        console.log('Decremento completato:', updatedItem);
        item.quantity = newQuantity;
        this.calculateTotal();
        this.cartService.updateCartCount(this.cartItems);
        this.toastService.success('Quantità diminuita');
      },
      error: (err) => {
        console.error('Errore nel decremento della quantità', err);
        
        // Se l'errore è dovuto al fatto che l'item non esiste nel carrello locale,
        // aggiorna direttamente l'item corrente
        if (err.message === 'Item not found in local cart') {
          console.log('Item non trovato nel carrello locale, aggiornamento diretto');
          item.quantity = newQuantity;
          this.calculateTotal();
          this.toastService.warning('Carrello sincronizzato localmente');
        } else {
          this.toastService.error('Errore nell\'aggiornamento della quantità');
        }
      }
    });
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
