import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = `${environment.apiUrl}/artists`;

  constructor(private http: HttpClient) { }

  getArtists(search?: string): Observable<any> {
    let queryParams = '';
    if (search) {
      queryParams = `?search=${encodeURIComponent(search)}`;
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

  getArtistById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.status === 'success') {
          return {
            success: true,
            data: {
              artist: response.data
            }
          };
        }
        return response;
      })
    );
  }
} 