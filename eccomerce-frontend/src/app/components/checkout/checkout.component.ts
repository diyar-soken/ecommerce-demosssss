import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from '../../services/checkout.service';
import { CheckoutRequest } from '../../models/order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', Validators.required],
      paymentMethod: ['credit_card', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const checkoutRequest: CheckoutRequest = this.checkoutForm.value;
      this.checkoutService.checkout(checkoutRequest).subscribe({
        next: (order) => {
          this.router.navigate(['/home'], {
            queryParams: { orderSuccess: true }
          });
        },
        error: (err) => {
          console.error('Checkout failed', err);
        }
      });
    }
  }
}
