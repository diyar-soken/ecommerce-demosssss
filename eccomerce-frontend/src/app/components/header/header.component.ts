import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';  // importa il servizio
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount: number = 0;
  cartTotal: number = 0;
  isDarkMode: boolean = false;
  cartAnimated: boolean = false;
  private subscriptions: Subscription = new Subscription();

  logoLightPath: string = '../../../assets/images/logo-nero.png';
  logoDarkPath: string = '../../../assets/images/logo-bianco.png';

  constructor(
    public authService: AuthService,
    private router: Router,
    public cartService: CartService,
    public themeService: ThemeService,   // inietta il servizio
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Subscribe al contatore del carrello
    this.subscriptions.add(
      this.cartService.cartCount$.subscribe(count => {
        if (count > this.cartCount) {
          this.animateCartCounter();
        }
        this.cartCount = count;
      })
    );

    // Subscribe ai cambiamenti del carrello e calcola il totale
    this.subscriptions.add(
      this.cartService.getCartItems().subscribe(items => {
        this.cartService.updateCartCount(items);
      })
    );

    // Subscribe al totale del carrello
    this.subscriptions.add(
      this.cartService.cartTotal$.subscribe(total => {
        this.cartTotal = total;
      })
    );

    // Subscribe al tema
    this.subscriptions.add(
      this.themeService.isDarkMode$.subscribe(mode => {
        this.isDarkMode = mode;
      })
    );

    // Subscribe alle animazioni del carrello dal servizio notifiche
    this.subscriptions.add(
      this.notificationService.cartAnimation$.subscribe(animate => {
        if (animate) {
          this.animateCartCounter();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateCartTotal(items: any[]): void {
    // Calcola il totale del carrello con controllo per valori undefined
    this.cartTotal = items.reduce((total, item) => {
      const price = item.productPrice || item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  private animateCartCounter(): void {
    this.cartAnimated = true;
    setTimeout(() => {
      this.cartAnimated = false;
    }, 600);
  }
}
