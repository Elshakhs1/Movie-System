import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

interface User {
  email: string;
  name: string;
  _id: string;
}

interface AuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://167.86.87.73:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.verifyToken().subscribe();
    }
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, {
      email,
      password,
      name
    }).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  registerAdmin(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register-admin`, {
      email,
      password,
      name
    }).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    console.log('Login attempt:', { email, url: `${this.baseUrl}/login` });
    
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        console.log('Login response:', response);
        this.handleAuthentication(response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        
        if (error.status === 0) {
          // Network error (CORS, server unreachable)
          return throwError(() => ({
            error: {
              message: 'Cannot connect to server. Please check your network connection.'
            }
          }));
        }
        
        return throwError(() => error);
      })
    );
  }

  verifyToken(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/verify-token`).pipe(
      tap(response => {
        if (response.status === 'success' && response.data?.user) {
          this.currentUserSubject.next(response.data.user);
        } else {
          this.logout();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  private handleAuthentication(response: AuthResponse): void {
    if (response.status === 'success' && response.data?.token) {
      localStorage.setItem(this.tokenKey, response.data.token);
      this.currentUserSubject.next(response.data.user);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
} 