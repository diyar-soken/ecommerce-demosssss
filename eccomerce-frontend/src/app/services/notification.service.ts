import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SoundService } from './sound.service';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  productImage?: string;
  productName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private cartAnimationSubject = new BehaviorSubject<boolean>(false);
  public cartAnimation$ = this.cartAnimationSubject.asObservable();

  private flyingProductSubject = new BehaviorSubject<any>(null);
  public flyingProduct$ = this.flyingProductSubject.asObservable();

  constructor(private soundService: SoundService) { }

  showNotification(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 4000
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto-remove notification after duration
    setTimeout(() => {
      this.removeNotification(id);
    }, newNotification.duration);
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  showAddToCartSuccess(productName: string, productImage?: string): void {
    this.showNotification({
      type: 'success',
      title: 'Prodotto aggiunto!',
      message: `${productName} è stato aggiunto al carrello`,
      productImage,
      productName,
      duration: 3500
    });

    // Play success sound
    this.soundService.playAddToCartSound();

    // Trigger flying product animation
    this.triggerFlyingProduct(productName, productImage);
    
    // Trigger cart animation
    this.triggerCartAnimation();
  }

  triggerFlyingProduct(productName: string, productImage?: string): void {
    this.flyingProductSubject.next({
      productName,
      productImage,
      timestamp: Date.now()
    });
  }

  triggerCartAnimation(): void {
    this.cartAnimationSubject.next(true);
    setTimeout(() => {
      this.cartAnimationSubject.next(false);
    }, 600);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}