import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    let authReq = req.clone({
      headers: req.headers.set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    });

    // Aggiungi il token JWT se presente
    if (token) {
      authReq = authReq.clone({
        headers: authReq.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    return next.handle(authReq);
  }
}
