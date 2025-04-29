import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'http://167.86.87.73:3000/api/movies';

  constructor(private http: HttpClient) { }

  // Get all movies with optional filtering (GET /movies)
  getAllMovies(params?: any): Observable<any> {
    return this.http.get(this.baseUrl, { params });
  }

  // Get a specific movie by ID (GET /movies/:id)
  getMovieById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Create a new movie - admin only (POST /movies)
  createMovie(movieData: any): Observable<any> {
    return this.http.post(this.baseUrl, movieData);
  }

  // Upload a poster for a movie - admin only (POST /movies/:id/poster)
  uploadPoster(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/${id}/poster`, formData);
  }

  // Delete a movie - admin only (DELETE /movies/:id)
  deleteMovie(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
} 