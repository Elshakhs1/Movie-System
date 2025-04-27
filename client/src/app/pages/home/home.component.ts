import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-6">Discover Movies</h1>
        
        <div class="flex flex-col lg:flex-row items-start gap-4 mb-6">
          <div class="form-control w-full lg:w-96">
            <div class="input-group">
              <input 
                type="text" 
                placeholder="Search movies..." 
                class="input input-bordered w-full"
                [(ngModel)]="searchTerm"
                (keyup.enter)="search()"
              />
              <button class="btn btn-square" (click)="search()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <div class="form-control w-full sm:w-auto">
              <select class="select select-bordered" [(ngModel)]="selectedGenre" (change)="search()">
                <option value="">All Genres</option>
                <option *ngFor="let genre of availableGenres" [value]="genre">{{ genre }}</option>
              </select>
            </div>
            
            <div class="form-control w-full sm:w-auto">
              <select class="select select-bordered" [(ngModel)]="selectedYear" (change)="search()">
                <option value="">All Years</option>
                <option *ngFor="let year of availableYears" [value]="year">{{ year }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div *ngFor="let movie of movies" class="card bg-base-200 shadow-xl">
          <figure class="h-[300px]">
            <img *ngIf="movie.posterUrl" [src]="movie.posterUrl" [alt]="movie.title" class="h-full w-full object-cover" />
            <div *ngIf="!movie.posterUrl" class="h-full w-full flex items-center justify-center bg-neutral-focus text-neutral-content">
              <span class="text-2xl">{{ movie.title }}</span>
            </div>
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ movie.title }}</h2>
            <div class="flex items-center mb-2">
              <div class="badge badge-primary mr-2">{{ movie.releaseYear }}</div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="ml-1">{{ movie.averageRating.toFixed(1) }}</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-1 mb-3">
              <span *ngFor="let genre of movie.genres.slice(0, 3)" class="badge badge-outline">{{ genre }}</span>
            </div>
            <p class="text-sm line-clamp-3">{{ movie.description }}</p>
            <div class="card-actions justify-end mt-3">
              <button class="btn btn-primary btn-sm" [routerLink]="['/movies', movie._id]">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="flex justify-center my-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div *ngIf="!loading && movies.length === 0" class="alert alert-info my-8">
        No movies found. Try adjusting your search filters.
      </div>

      <div *ngIf="!loading && movies.length > 0 && totalPages > 1" class="flex justify-center my-8">
        <div class="join">
          <button 
            class="join-item btn" 
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)"
          >
            «
          </button>
          <button class="join-item btn">Page {{ currentPage }} of {{ totalPages }}</button>
          <button 
            class="join-item btn" 
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)"
          >
            »
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  totalMovies = 0;
  currentPage = 1;
  pageSize = 12;
  totalPages = 0;
  searchTerm = '';
  selectedGenre = '';
  selectedYear = '';
  
  // Sample genres and years - these should ideally come from the API
  availableGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance'];
  availableYears = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    
    const queryParams = {
      page: this.currentPage,
      limit: this.pageSize,
      ...(this.searchTerm ? { searchTerm: this.searchTerm } : {}),
      ...(this.selectedGenre ? { genre: this.selectedGenre } : {}),
      ...(this.selectedYear ? { year: Number(this.selectedYear) } : {})
    };
    
    this.movieService.getMovies(queryParams).subscribe({
      next: (response) => {
        this.movies = response.data.movies;
        this.totalMovies = response.data.total;
        this.totalPages = Math.ceil(this.totalMovies / this.pageSize);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.movies = [];
      }
    });
  }

  search(): void {
    this.currentPage = 1;
    this.loadMovies();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadMovies();
  }
} 