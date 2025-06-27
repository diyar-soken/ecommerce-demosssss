import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<number>();
  @Output() quickView = new EventEmitter<Product>();
  
  isClicked = false;

  constructor(private soundService: SoundService) {}

  onAddToCart(): void {
    this.isClicked = true;
    
    // Play click sound
    this.soundService.playClickSound();
    
    this.addToCart.emit(this.product.id);
    
    // Reset animation after 600ms
    setTimeout(() => {
      this.isClicked = false;
    }, 600);
  }

  onQuickView(): void {
    // Play click sound
    this.soundService.playClickSound();
    
    this.quickView.emit(this.product);
  }
}
