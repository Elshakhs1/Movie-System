import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) { }

  getRatingStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ratings`).pipe(
      map(response => {
        if (response.status === 'success') {
          return {
            success: true,
            data: response.data
          };
        }
        return response;
      })
    );
  }
} 