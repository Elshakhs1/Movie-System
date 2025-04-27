import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RatingStatResponse } from '../models/rating.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getRatingStats(movieId: string, groupBy: 'age' | 'gender' | 'country'): Observable<RatingStatResponse> {
    let params = new HttpParams()
      .set('movieId', movieId)
      .set('groupBy', groupBy);

    return this.http.get<RatingStatResponse>(`${this.apiUrl}/ratings`, { params });
  }
} 