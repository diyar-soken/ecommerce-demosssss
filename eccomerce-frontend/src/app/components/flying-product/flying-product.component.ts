import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

export interface FlyingProduct {
  id: string;
  productName: string;
  productImage: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

@Component({
  selector: 'app-flying-product',
  template: `
    <div class="flying-products-container">
      <div 
        *ngFor="let product of flyingProducts; trackBy: trackByProductId"
        class="flying-product"
        [style.left.px]="product.startX"
        [style.top.px]="product.startY"
        [style.--end-x.px]="product.endX"
        [style.--end-y.px]="product.endY"
      >
        <div class="product-wrapper">
          <img 
            [src]="product.productImage" 
            [alt]="product.productName"
            class="product-image"
          >
          <div class="product-trail"></div>
          <div class="product-glow"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./flying-product.component.css']
})
export class FlyingProductComponent implements OnInit, OnDestroy {
  flyingProducts: FlyingProduct[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Ascolta quando viene triggerato un prodotto volante
    this.subscription.add(
      this.notificationService.flyingProduct$.subscribe(productData => {
        if (productData) {
          this.startFlyingAnimation(productData);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private startFlyingAnimation(productData: any): void {
    // Trova la posizione del pulsante "Aggiungi al carrello" più recente
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .btn-primary');
    const cartIcon = document.querySelector('.cart-link, .cart-icon');
    
    if (addToCartButtons.length === 0 || !cartIcon) return;

    // Usa l'ultimo pulsante cliccato (assumiamo sia quello più recente)
    const lastButton = addToCartButtons[addToCartButtons.length - 1];
    const buttonRect = lastButton.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingProduct: FlyingProduct = {
      id: this.generateId(),
      productName: productData.productName || 'Prodotto',
      productImage: productData.productImage || '/assets/images/default-product.png',
      startX: buttonRect.left + buttonRect.width / 2,
      startY: buttonRect.top + buttonRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2
    };

    this.flyingProducts.push(flyingProduct);

    // Rimuovi il prodotto volante dopo l'animazione
    setTimeout(() => {
      this.removeFlyingProduct(flyingProduct.id);
    }, 1200);
  }

  private removeFlyingProduct(id: string): void {
    this.flyingProducts = this.flyingProducts.filter(p => p.id !== id);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  trackByProductId(index: number, product: FlyingProduct): string {
    return product.id;
  }
}