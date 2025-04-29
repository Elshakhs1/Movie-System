import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

// Get token directly from localStorage to avoid circular dependency
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = getAuthToken();
  
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  
  return next(req);
}; 