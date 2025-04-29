import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class MoviesComponent implements OnInit {
  movies: any[] = [];
  isLoading = false;
  searchForm: FormGroup;
  totalMovies = 0;
  currentPage = 1;
  pageSize = 10;
  genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Fantasy', 'Animation'];
  years: number[] = [];
  Math = Math; // Add Math object for template

  constructor(
    private movieService: MovieService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      genre: [''],
      year: ['']
    });
    
    // Generate years from 1970 to current year
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1970; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
    this.loadMovies();
    
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadMovies();
      });

    this.searchForm.get('genre')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadMovies();
    });

    this.searchForm.get('year')?.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadMovies();
    });
  }

  loadMovies(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage,
      limit: this.pageSize
    };

    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    const genre = this.searchForm.get('genre')?.value;
    if (genre) {
      params.genre = genre;
    }

    const year = this.searchForm.get('year')?.value;
    if (year) {
      params.year = year;
    }

    this.movieService.getAllMovies(params).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.movies) {
          this.movies = response.data.movies;
          this.totalMovies = response.data.total;
        } else {
          this.movies = [];
          this.totalMovies = 0;
          console.error('Unexpected response format:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.isLoading = false;
      }
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadMovies();
  }

  clearFilters(): void {
    this.searchForm.reset();
    this.loadMovies();
  }
}
