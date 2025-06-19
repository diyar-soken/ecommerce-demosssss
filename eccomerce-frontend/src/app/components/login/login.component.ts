import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  returnUrl: string = '/home';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    
    // Ottieni l'URL di ritorno dai query parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const authRequest: AuthRequest = this.loginForm.value;
      this.authService.login(authRequest).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            name: response.name,
            email: response.email
          }));
          
          // Sincronizza il carrello locale con il server
          this.cartService.syncCartAfterLogin().subscribe({
            next: () => {
              this.toastService.success(`Benvenuto, ${response.name}! 🎉`);
              this.router.navigate([this.returnUrl]);
            },
            error: (syncError) => {
              console.error('Errore sincronizzazione carrello:', syncError);
              this.toastService.success(`Benvenuto, ${response.name}! 🎉`);
              this.router.navigate([this.returnUrl]);
            }
          });
        },
        error: (err) => {
          this.errorMessage = 'Email o password non validi';
          this.toastService.error('Credenziali non valide');
        }
      });
    }
  }
}
