import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://167.86.87.73:3000/api/movies';

  constructor(private http: HttpClient) { }

  // Get all comments for a movie (GET /movies/:movieId/comments)
  getMovieComments(movieId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${movieId}/comments`);
  }

  // Add a comment to a movie (POST /movies/:movieId/comments)
  addComment(movieId: string, commentData: { text: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${movieId}/comments`, commentData);
  }

  // Delete a comment from a movie (DELETE /movies/:movieId/comments/:commentId)
  deleteComment(movieId: string, commentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${movieId}/comments/${commentId}`);
  }
}
