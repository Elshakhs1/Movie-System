import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private baseUrl = 'http://167.86.87.73:3000/api/stats';

  constructor(private http: HttpClient) { }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
} 