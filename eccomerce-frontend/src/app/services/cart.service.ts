import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartItem } from '../models/cart.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  private localCartKey = 'pear_local_cart';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCartCount();
  }

  getCartItems(): Observable<CartItem[]> {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.get<CartItem[]>(this.apiUrl, { headers });
    } else {
      return of(this.getLocalCartItems());
    }
  }

  addToCart(productId: number, productName?: string, productPrice?: number, productImage?: string): Observable<CartItem> {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post<CartItem>(`${this.apiUrl}/add/${productId}`, {}, { headers }).pipe(
        tap(() => {
          // Aggiorna il contatore dopo aver aggiunto al server
          this.loadCartCount();
        })
      );
    } else {
      return this.addToLocalCart(productId, productName, productPrice, productImage);
    }
  }

  removeFromCart(itemId: number): Observable<void> {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this.http.delete<void>(`${this.apiUrl}/remove/${itemId}`, { headers });
    } else {
      return this.removeFromLocalCart(itemId);
    }
  }

  clearCart(): Observable<void> {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.delete<void>(`${this.apiUrl}/clear`, { headers });
    } else {
      return this.clearLocalCart();
    }
  }

  updateCartCount(items: CartItem[]) {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    this.cartCount.next(count);
  }

  getCartCount(): number {
    return this.cartCount.getValue();
  }

  // Metodi per gestire il carrello locale
  private getLocalCartItems(): CartItem[] {
    const cartData = localStorage.getItem(this.localCartKey);
    return cartData ? JSON.parse(cartData) : [];
  }

  private saveLocalCartItems(items: CartItem[]): void {
    localStorage.setItem(this.localCartKey, JSON.stringify(items));
    this.updateCartCount(items);
  }

  private addToLocalCart(productId: number, productName?: string, productPrice?: number, productImage?: string): Observable<CartItem> {
    const items = this.getLocalCartItems();
    const existingItem = items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem: CartItem = {
        id: Date.now(), // ID temporaneo
        productId: productId,
        productName: productName || `Prodotto ${productId}`,
        productPrice: productPrice || 0,
        productImageUrl: productImage || '',
        quantity: 1
      };
      items.push(newItem);
    }
    
    this.saveLocalCartItems(items);
    const addedItem = items.find(item => item.productId === productId)!;
    return of(addedItem);
  }

  private removeFromLocalCart(itemId: number): Observable<void> {
    const items = this.getLocalCartItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    this.saveLocalCartItems(filteredItems);
    return of(void 0);
  }

  private clearLocalCart(): Observable<void> {
    localStorage.removeItem(this.localCartKey);
    this.cartCount.next(0);
    return of(void 0);
  }

  private loadCartCount(): void {
    if (this.authService.isLoggedIn()) {
      this.getCartItems().subscribe(items => {
        this.updateCartCount(items);
      });
    } else {
      const localItems = this.getLocalCartItems();
      this.updateCartCount(localItems);
    }
  }

  // Metodo per sincronizzare il carrello locale con il server dopo il login
  syncCartAfterLogin(): Observable<void> {
    const localItems = this.getLocalCartItems();
    if (localItems.length === 0) {
      return of(void 0);
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Aggiungi tutti gli elementi locali al carrello del server
    const syncPromises = localItems.map(item => 
      this.http.post<CartItem>(`${this.apiUrl}/add/${item.productId}`, {}, { headers }).toPromise()
    );

    return new Observable(observer => {
      Promise.all(syncPromises).then(() => {
        this.clearLocalCart().subscribe(() => {
          this.loadCartCount();
          observer.next();
          observer.complete();
        });
      }).catch(error => {
        observer.error(error);
      });
    });
  }



}
