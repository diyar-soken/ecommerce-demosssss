import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  @Input() cart: Product[] = [];
  orderConfirmed = false;

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  confirmOrder() {
    // Qui potresti fare una chiamata al backend per salvare l’ordine
    console.log('Ordine confermato:', this.cart);
    this.orderConfirmed = true;
    this.cart = []; // svuota il carrello
  }
}
