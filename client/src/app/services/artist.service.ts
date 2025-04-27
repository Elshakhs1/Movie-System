import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist, ArtistResponse, ArtistsResponse, CreateArtistRequest } from '../models/artist.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = `${environment.apiUrl}/artists`;

  constructor(private http: HttpClient) {}

  getArtists(search?: string): Observable<ArtistsResponse> {
    let params = new HttpParams();
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ArtistsResponse>(this.apiUrl, { params });
  }

  createArtist(artist: CreateArtistRequest): Observable<ArtistResponse> {
    return this.http.post<ArtistResponse>(this.apiUrl, artist);
  }
} 