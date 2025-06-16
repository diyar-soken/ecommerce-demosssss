import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import { AuthRequest, AuthResponse, SignupRequest } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  public errorMessage: string = '';

  constructor(private http: HttpClient) { }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      authRequest,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response' // Ricevi tutta la risposta
      }
    ).pipe(
      map(response => {
        if (response.status === 200 && response.body) {
          return response.body;
        }
        throw new Error('Login failed');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Dettaglio errore:', error);
        let errorMessage = 'Errore durante il login';

        if (error.status === 403) {
          errorMessage = 'Accesso negato - verifica le credenziali';
        } else if (error.status === 401) {
          errorMessage = 'Email o password non validi';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }


  register(signupRequest: SignupRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, signupRequest, {
      responseType: 'text' // Forza l'interpretazione come testo
    }).pipe(
      map(response => {
        try {
          return JSON.parse(response); // Prova a convertire se è JSON
        } catch (e) {
          return { message: response }; // Fallback a oggetto
        }
      }),
      catchError(error => {
        // Gestione errori migliorata
        if (error.error instanceof ErrorEvent) {
          // Errore client-side
          console.error('Client error:', error.error.message);
        } else {
          // Errore server-side
          console.error(`Server error: ${error.status} - ${error.error}`);
        }
        return throwError(() => new Error('Registration failed'));
      })
    );
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
