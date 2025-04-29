import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Movie, 
  MovieResponse, 
  MoviesResponse, 
  Rating, 
  RatingResponse, 
  Comment, 
  CommentResponse,
  MovieFilters
} from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = `${environment.apiUrl}/movies`;

  constructor(private http: HttpClient) { }

  // Get all movies with optional filtering
  getMovies(filters: MovieFilters = {}): Observable<MoviesResponse> {
    let queryParams = '';
    
    if (Object.keys(filters).length > 0) {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(`${key}[]`, item));
          } else {
            params.append(key, value.toString());
          }
        }
      });
      
      queryParams = `?${params.toString()}`;
    }
    
    return this.http.get<any>(`${this.apiUrl}${queryParams}`).pipe(
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

  // Get movie by ID
  getMovieById(id: string): Observable<MovieResponse> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.status === 'success') {
          return {
            success: true,
            data: {
              movie: response.data
            }
          };
        }
        return response;
      })
    );
  }

  // Add a new rating
  addRating(movieId: string, rating: number): Observable<RatingResponse> {
    return this.http.post<any>(`${this.apiUrl}/${movieId}/ratings`, { rating }).pipe(
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

  // Get ratings for a movie
  getRatings(movieId: string): Observable<RatingResponse> {
    return this.http.get<any>(`${this.apiUrl}/${movieId}/ratings`).pipe(
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

  // Add a new comment
  addComment(movieId: string, content: string): Observable<CommentResponse> {
    return this.http.post<any>(`${this.apiUrl}/${movieId}/comments`, { text: content }).pipe(
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

  // Get comments for a movie
  getComments(movieId: string): Observable<CommentResponse> {
    return this.http.get<any>(`${this.apiUrl}/${movieId}/comments`).pipe(
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

  // Delete a comment
  deleteComment(movieId: string, commentId: string): Observable<{ success: boolean }> {
    return this.http.delete<any>(`${this.apiUrl}/${movieId}/comments/${commentId}`).pipe(
      map(response => {
        if (response.status === 'success') {
          return { success: true };
        }
        return { success: false };
      })
    );
  }
} 