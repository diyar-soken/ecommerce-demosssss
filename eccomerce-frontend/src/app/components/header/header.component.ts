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
  isDarkMode: boolean = false;

  logoLightPath: string = '../../../assets/images/logo-nero.png';
  logoDarkPath: string = '../../../assets/images/logo-bianco.png';

  constructor(
    public authService: AuthService,
    private router: Router,
    public cartService: CartService,
    public themeService: ThemeService   // inietta il servizio
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.cartService.getCartItems().subscribe(items => {
      this.cartService.updateCartCount(items);
    });

    this.themeService.isDarkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
