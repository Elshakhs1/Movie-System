import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://167.86.87.73:3000/api/movies';
  private apiUrl = 'http://167.86.87.73:3000/api';

  constructor(private http: HttpClient) { }

  // Rate a movie (POST /movies/:movieId/ratings)
  rateMovie(movieId: string, ratingData: { score: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${movieId}/ratings`, ratingData);
  }

  // Get rating statistics (GET /stats/ratings)
  getRatingStats(movieId: string, groupBy?: string): Observable<any> {
    let params: any = {};
    if (groupBy) {
      params.groupBy = groupBy;
    }
    if (movieId) {
      params.movieId = movieId;
    }
    return this.http.get(`${this.apiUrl}/stats/ratings`, { params });
  }
}
