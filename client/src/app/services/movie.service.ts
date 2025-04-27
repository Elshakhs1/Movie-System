import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    
    return this.http.get<MoviesResponse>(`${this.apiUrl}${queryParams}`);
  }

  // Get movie by ID
  getMovieById(id: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/${id}`);
  }

  // Add a new rating
  addRating(movieId: string, rating: number): Observable<RatingResponse> {
    return this.http.post<RatingResponse>(`${this.apiUrl}/${movieId}/ratings`, { rating });
  }

  // Get ratings for a movie
  getRatings(movieId: string): Observable<RatingResponse> {
    return this.http.get<RatingResponse>(`${this.apiUrl}/${movieId}/ratings`);
  }

  // Add a new comment
  addComment(movieId: string, content: string): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}/${movieId}/comments`, { content });
  }

  // Get comments for a movie
  getComments(movieId: string): Observable<CommentResponse> {
    return this.http.get<CommentResponse>(`${this.apiUrl}/${movieId}/comments`);
  }

  // Delete a comment
  deleteComment(movieId: string, commentId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${movieId}/comments/${commentId}`);
  }
} 