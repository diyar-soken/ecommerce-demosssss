import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

interface SuccessIndicator {
  id: string;
  x: number;
  y: number;
  productName: string;
}

@Component({
  selector: 'app-success-indicator',
  template: `
    <div class="success-indicators-container">
      <div 
        *ngFor="let indicator of successIndicators; trackBy: trackByIndicatorId"
        class="success-indicator"
        [style.left.px]="indicator.x"
        [style.top.px]="indicator.y"
      >
        <div class="success-content">
          <div class="success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <div class="success-text">{{ indicator.productName }}</div>
        </div>
        <div class="success-glow"></div>
      </div>
    </div>
  `,
  styleUrls: ['./success-indicator.component.css']
})
export class SuccessIndicatorComponent implements OnInit, OnDestroy {
  successIndicators: SuccessIndicator[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.flyingProduct$.subscribe(productData => {
        if (productData) {
          this.showSuccessIndicator(productData);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private showSuccessIndicator(productData: any): void {
    // Trova l'ultimo pulsante cliccato
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .btn-primary');
    
    if (addToCartButtons.length === 0) return;

    const lastButton = addToCartButtons[addToCartButtons.length - 1];
    const buttonRect = lastButton.getBoundingClientRect();

    const indicator: SuccessIndicator = {
      id: this.generateId(),
      x: buttonRect.left + buttonRect.width / 2 - 50, // Centra l'indicatore
      y: buttonRect.top - 60, // Posiziona sopra il pulsante
      productName: productData.productName || 'Aggiunto!'
    };

    this.successIndicators.push(indicator);

    // Rimuovi l'indicatore dopo l'animazione
    setTimeout(() => {
      this.removeSuccessIndicator(indicator.id);
    }, 2000);
  }

  private removeSuccessIndicator(id: string): void {
    this.successIndicators = this.successIndicators.filter(i => i.id !== id);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  trackByIndicatorId(index: number, indicator: SuccessIndicator): string {
    return indicator.id;
  }
}