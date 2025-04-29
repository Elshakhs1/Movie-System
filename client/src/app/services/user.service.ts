import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://167.86.87.73:3000/api';

  constructor(private http: HttpClient) { }

  // Get the current user profile (GET /auth/verify-token)
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/verify-token`);
  }

  // No update profile endpoint exists in the API
  // No promote endpoint exists in the API
}
