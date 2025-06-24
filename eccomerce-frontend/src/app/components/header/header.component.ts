import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';  // importa il servizio

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;
  cartTotal: number = 0;
  isDarkMode: boolean = false;
  cartAnimated: boolean = false;

  logoLightPath: string = '../../../assets/images/logo-nero.png';
  logoDarkPath: string = '../../../assets/images/logo-bianco.png';

  constructor(
    public authService: AuthService,
    private router: Router,
    public cartService: CartService,
    public themeService: ThemeService   // inietta il servizio
  ) {}

  ngOnInit(): void {
    // Subscribe al contatore del carrello
    this.cartService.cartCount$.subscribe(count => {
      if (count > this.cartCount) {
        this.animateCartCounter();
      }
      this.cartCount = count;
    });

    // Subscribe ai cambiamenti del carrello e calcola il totale
    this.cartService.getCartItems().subscribe(items => {
      this.cartService.updateCartCount(items);
      this.calculateCartTotal(items);
    });

    // Subscribe al tema
    this.themeService.isDarkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
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
