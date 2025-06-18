import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { CartItem } from '../models/cart.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor(private http: HttpClient) { }

  getCartItems(): Observable<CartItem[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<CartItem[]>(this.apiUrl, { headers });

  }

  addToCart(productId: number): Observable<CartItem> {
    const token = localStorage.getItem('token'); // o dove lo salvi
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<CartItem>(`${this.apiUrl}/add/${productId}`, {}, { headers });
  }

  removeFromCart(itemId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/remove/${itemId}`);
  }

  clearCart(): Observable<void> {
    const token = localStorage.getItem('token'); // o dove lo salvi
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.apiUrl}/clear`);
  }

  updateCartCount(items: CartItem[]) {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    this.cartCount.next(count);
  }
  getCartCount(): number {
    return this.cartCount.getValue();
  }



}
