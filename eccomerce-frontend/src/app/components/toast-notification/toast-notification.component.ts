import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-toast-notification',
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let notification of notifications; trackBy: trackByNotificationId"
        class="toast-notification"
        [ngClass]="'toast-' + notification.type"
        [@slideInOut]
      >
        <div class="toast-content">
          <div class="toast-icon">
            <i *ngIf="notification.type === 'success'" class="fas fa-check-circle"></i>
            <i *ngIf="notification.type === 'error'" class="fas fa-times-circle"></i>
            <i *ngIf="notification.type === 'info'" class="fas fa-info-circle"></i>
            <i *ngIf="notification.type === 'warning'" class="fas fa-exclamation-triangle"></i>
          </div>
          
          <div class="toast-body">
            <div class="toast-header">
              <h6 class="toast-title">{{ notification.title }}</h6>
              <button 
                class="toast-close" 
                (click)="removeNotification(notification.id)"
                aria-label="Close"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="toast-message-container">
              <img 
                *ngIf="notification.productImage" 
                [src]="notification.productImage" 
                [alt]="notification.productName"
                class="toast-product-image"
              >
              <p class="toast-message">{{ notification.message }}</p>
            </div>
          </div>
        </div>
        
        <div class="toast-progress">
          <div class="toast-progress-bar" [style.animation-duration]="notification.duration + 'ms'"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}