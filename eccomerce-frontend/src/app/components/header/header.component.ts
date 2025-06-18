import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartCount: number = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // Facoltativo: forza il caricamento degli item all'avvio
    this.cartService.getCartItems().subscribe(items => {
      this.cartService.updateCartCount(items); // assicura il valore iniziale
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
