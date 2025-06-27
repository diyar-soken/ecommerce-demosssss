import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart.model';
import { Order, ShippingAddress, CheckoutRequest } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  orderConfirmed = false;
  isLoading = false;
  errorMessage = '';
  confirmedOrder: Order | null = null;
  shippingForm: FormGroup;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.shippingForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      addressLine1: ['', [Validators.required, Validators.minLength(5)]],
      addressLine2: [''],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      province: ['', [Validators.required, Validators.minLength(2)]],
      country: ['Italia', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/)]]
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: (error) => {
        console.error('Errore nel caricamento del carrello:', error);
        this.errorMessage = 'Errore nel caricamento del carrello';
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => {
      const price = item.product?.price || item.productPrice || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  confirmOrder() {
    if (this.cartItems.length === 0) {
      this.errorMessage = 'Il carrello è vuoto';
      return;
    }

    if (this.shippingForm.invalid) {
      this.errorMessage = 'Compila tutti i campi obbligatori per l\'indirizzo di spedizione';
      this.markFormGroupTouched(this.shippingForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const checkoutRequest: CheckoutRequest = {
      shippingAddress: this.shippingForm.value as ShippingAddress,
      paymentMethod: 'CARD' // Puoi estendere questo in futuro
    };

    this.orderService.checkout(checkoutRequest).subscribe({
      next: (order) => {
        this.confirmedOrder = order;
        this.orderConfirmed = true;
        this.cartItems = []; // svuota il carrello locale
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nella conferma dell\'ordine:', error);
        this.errorMessage = 'Errore nella conferma dell\'ordine. Riprova.';
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.shippingForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.shippingForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} è obbligatorio`;
      if (field.errors['minlength']) return `${fieldName} troppo corto`;
      if (field.errors['pattern']) {
        if (fieldName === 'postalCode') return 'Inserisci un CAP valido (5 cifre)';
        if (fieldName === 'phoneNumber') return 'Inserisci un numero di telefono valido';
      }
    }
    return '';
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }
}