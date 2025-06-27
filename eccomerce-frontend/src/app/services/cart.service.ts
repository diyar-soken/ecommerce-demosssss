import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
  private cartTotal = new BehaviorSubject<number>(0);
  cartTotal$ = this.cartTotal.asObservable();
  private localCartKey = 'pear_local_cart';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCartCount();
  }

  getCartItems(): Observable<CartItem[]> {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Token non trovato, caricamento carrello locale');
        return of(this.getLocalCartItems());
      }
      
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      
      return this.http.get<CartItem[]>(this.apiUrl, { headers }).pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            console.warn('Errore di autenticazione nel caricamento carrello, passaggio al carrello locale:', error);
            return of(this.getLocalCartItems());
          }
          return throwError(() => error);
        })
      );
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

  updateQuantity(itemId: number, quantity: number): Observable<CartItem> {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Token non trovato, passaggio al carrello locale');
        return this.updateLocalCartQuantity(itemId, quantity);
      }
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      
      return this.http.put<CartItem>(`${this.apiUrl}/update/${itemId}`, { quantity }, { headers }).pipe(
        tap(() => {
          this.loadCartCount();
        }),
        // In caso di errore 403, prova a trovare l'item nel carrello locale
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            console.warn('Errore di autenticazione, tentativo di aggiornamento nel carrello locale:', error);
            // Prova prima a trovare l'item nel carrello locale
            const localItems = this.getLocalCartItems();
            const localItem = localItems.find(item => item.id === itemId);
            
            if (localItem) {
              return this.updateLocalCartQuantity(itemId, quantity);
            } else {
              // Se l'item non esiste nel carrello locale, prova a trovarlo per productId
              // Questo può succedere quando l'item era sul server ma ora dobbiamo usare il carrello locale
              console.warn(`Item ${itemId} non trovato nel carrello locale, impossibile aggiornare`);
              return throwError(() => new Error('Item not found in local cart'));
            }
          }
          return throwError(() => error);
        })
      );
    } else {
      return this.updateLocalCartQuantity(itemId, quantity);
    }
  }

  removeFromCart(itemId: number): Observable<void> {
    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Token non trovato, passaggio al carrello locale');
        return this.removeFromLocalCart(itemId);
      }
      
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      
      return this.http.delete<void>(`${this.apiUrl}/remove/${itemId}`, { headers }).pipe(
        catchError((error) => {
          if (error.status === 403 || error.status === 401) {
            console.warn('Errore di autenticazione, passaggio al carrello locale:', error);
            return this.removeFromLocalCart(itemId);
          }
          return throwError(() => error);
        })
      );
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
    const total = items.reduce((sum, item) => {
      const price = item.product?.price || item.productPrice || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    this.cartCount.next(count);
    this.cartTotal.next(total);
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

  private updateLocalCartQuantity(itemId: number, quantity: number): Observable<CartItem> {
    try {
      const items = this.getLocalCartItems();
      const item = items.find(item => item.id === itemId);
      
      if (!item) {
        console.error(`Item con ID ${itemId} non trovato nel carrello locale`);
        return throwError(() => new Error('Item not found'));
      }

      if (quantity <= 0) {
        // Se la quantità è 0 o negativa, rimuovi l'item
        const filteredItems = items.filter(item => item.id !== itemId);
        this.saveLocalCartItems(filteredItems);
        console.log(`Item ${itemId} rimosso dal carrello locale (quantità <= 0)`);
        return of(item);
      } else {
        const oldQuantity = item.quantity;
        item.quantity = quantity;
        this.saveLocalCartItems(items);
        console.log(`Quantità aggiornata nel carrello locale per item ${itemId}: ${oldQuantity} -> ${quantity}`);
        return of(item);
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento del carrello locale:', error);
      return throwError(() => error);
    }
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
