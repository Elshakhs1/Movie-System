import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service
    const token = this.authService.getToken();
    
    console.log('Token present:', !!token); // Log if token exists
    
    // If token exists, clone the request and add the authorization header
    if (token) {
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Setting Authorization header:', `Bearer ${token.substring(0, 10)}...`); // Log part of the token
      
      // Handle the cloned request
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Auth error:', error.status, error.message);
          
          // Handle 401 Unauthorized errors
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login'], { 
              queryParams: { returnUrl: this.router.url }
            });
          }
          return throwError(() => error);
        })
      );
    }
    
    // Otherwise proceed with the original request
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle other errors
        return throwError(() => error);
      })
    );
  }
} 