import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { StatsService } from '../../services/stats.service';
import { Movie, Rating, Comment } from '../../models/movie.model';
import { User } from '../../models/user.model';
import { RatingStatResponse } from '../../models/rating.model';
import { formatDate } from '@angular/common';

interface RatingStat {
  rating: string | number;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-8" *ngIf="movie">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Movie Poster -->
        <div class="w-full md:w-1/3 lg:w-1/4">
          <div class="aspect-[2/3] bg-base-200 overflow-hidden rounded-lg shadow-lg">
            <img *ngIf="movie.posterUrl" [src]="movie.posterUrl" [alt]="movie.title" class="w-full h-full object-cover" />
            <div *ngIf="!movie.posterUrl" class="w-full h-full flex items-center justify-center bg-neutral-focus text-neutral-content">
              <span class="text-2xl">{{ movie.title }}</span>
            </div>
          </div>
          
          <!-- Rating Section -->
          <div class="card bg-base-200 shadow-lg mt-6 p-4">
            <div class="text-center mb-4">
              <div class="rating rating-lg">
                <input 
                  *ngFor="let star of [1, 2, 3, 4, 5]" 
                  type="radio" 
                  name="rating" 
                  class="mask mask-star-2 bg-orange-400" 
                  [checked]="userRating === star"
                  [disabled]="!currentUserValue || isRatingSubmitting"
                  (click)="setRating(star)"
                />
              </div>
              <p class="mt-2 text-sm">{{ userRating ? 'Your rating: ' + userRating + '/5' : 'Rate this movie' }}</p>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold">{{ movie.averageRating.toFixed(1) }}</div>
              <p class="text-sm text-base-content/70">Average from {{ movie.ratings.length }} ratings</p>
            </div>
            
            <div *ngIf="!currentUserValue" class="mt-4 text-center text-sm">
              <a routerLink="/login" class="link link-primary">Log in to rate this movie</a>
            </div>
          </div>
        </div>
        
        <!-- Movie Details -->
        <div class="flex-1">
          <h1 class="text-4xl font-bold mb-2">{{ movie.title }}</h1>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <div class="badge badge-primary">{{ movie.releaseYear }}</div>
            <div *ngFor="let genre of movie.genres" class="badge badge-outline">{{ genre }}</div>
          </div>
          
          <div class="prose max-w-none mb-6">
            <p>{{ movie.description }}</p>
          </div>
          
          <!-- Movie Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 class="text-lg font-semibold mb-2">Director</h3>
              <p>{{ getDirectorName(movie.director) }}</p>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold mb-2">Duration</h3>
              <p>{{ formatDuration(movie.duration) }}</p>
            </div>
          </div>
          
          <!-- Cast -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-4">Cast</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div *ngFor="let actor of movie.cast" class="card bg-base-200">
                <div class="card-body p-4">
                  <h4 class="card-title text-base">{{ actor.name }}</h4>
                  <p class="text-sm text-base-content/70">{{ getActorRole(actor) }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Rating Statistics -->
          <div class="mb-8" *ngIf="movie.ratings.length > 0">
            <h3 class="text-xl font-semibold mb-4">Rating Statistics</h3>
            
            <div class="tabs tabs-boxed mb-4">
              <a 
                class="tab" 
                [class.tab-active]="statFilter === 'age'" 
                (click)="loadRatingStats('age')"
              >By Age</a>
              <a 
                class="tab" 
                [class.tab-active]="statFilter === 'gender'" 
                (click)="loadRatingStats('gender')"
              >By Gender</a>
              <a 
                class="tab" 
                [class.tab-active]="statFilter === 'country'" 
                (click)="loadRatingStats('country')"
              >By Country</a>
            </div>
            
            <div *ngIf="ratingStats && ratingStats.length > 0" class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>{{ getStatFieldLabel() }}</th>
                    <th>Average Rating</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let stat of ratingStats">
                    <td>{{ stat.rating }}</td>
                    <td>{{ stat.percentage.toFixed(1) }}%</td>
                    <td>{{ stat.count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div *ngIf="isLoadingStats" class="py-4 flex justify-center">
              <span class="loading loading-spinner"></span>
            </div>
            
            <div *ngIf="!isLoadingStats && (!ratingStats || ratingStats.length === 0)" class="alert alert-info">
              No statistics available for the selected filter.
            </div>
          </div>
          
          <!-- Comments Section -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Comments ({{ movie.comments.length }})</h3>
            
            <!-- Add Comment -->
            <div *ngIf="currentUserValue" class="mb-6">
              <textarea 
                class="textarea textarea-bordered w-full" 
                rows="3" 
                placeholder="Write a comment..." 
                [(ngModel)]="newComment"
                [disabled]="isCommentSubmitting"
              ></textarea>
              <div class="flex justify-end mt-2">
                <button 
                  class="btn btn-primary" 
                  (click)="addComment()" 
                  [disabled]="!newComment.trim() || isCommentSubmitting"
                >
                  <span *ngIf="isCommentSubmitting" class="loading loading-spinner loading-xs mr-2"></span>
                  Post Comment
                </button>
              </div>
            </div>
            
            <div *ngIf="!currentUserValue" class="alert alert-info mb-6">
              <a routerLink="/login" class="link">Log in to comment</a> on this movie.
            </div>
            
            <!-- Comments List -->
            <div *ngIf="movie.comments.length > 0" class="space-y-4">
              <div *ngFor="let comment of sortedComments" class="card bg-base-200">
                <div class="card-body p-4">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h4 class="font-semibold">{{ getUserName(comment.user) }}</h4>
                      <p class="text-xs text-base-content/70">{{ formatDate(comment.createdAt) }}</p>
                    </div>
                    <button 
                      *ngIf="canDeleteComment(comment)" 
                      class="btn btn-ghost btn-xs" 
                      (click)="deleteComment(comment._id)"
                      [disabled]="commentDeleting"
                    >
                      <span *ngIf="commentDeleting === comment._id" class="loading loading-spinner loading-xs"></span>
                      <span *ngIf="commentDeleting !== comment._id">Delete</span>
                    </button>
                  </div>
                  <p>{{ getCommentContent(comment) }}</p>
                </div>
              </div>
            </div>
            
            <div *ngIf="movie.comments.length === 0" class="alert alert-info">
              No comments yet. Be the first to comment!
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div *ngIf="!movie && !isLoading" class="container py-8">
      <div class="alert alert-error">
        {{ errorMessage }}
      </div>
    </div>
    
    <div *ngIf="isLoading" class="container py-8 flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  `,
  styles: []
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  isLoading = true;
  errorMessage = '';
  currentUserValue: User | null = null;
  userRating = 0;
  hoverRating = 0;
  isRatingSubmitting = false;
  ratingStats: RatingStat[] = [];
  isLoadingStats = false;
  newComment = '';
  isCommentSubmitting = false;
  sortedComments: Comment[] = [];
  statFilter: 'age' | 'gender' | 'country' = 'age';
  commentDeleting: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    public authService: AuthService,
    private statsService: StatsService
  ) { }

  ngOnInit(): void {
    this.loadMovieData();
    
    this.authService.user$.subscribe(user => {
      this.currentUserValue = user;
      // Check user rating when user data changes
      if (this.movie) {
        this.checkUserRating();
      }
    });
  }

  loadMovieData(): void {
    this.isLoading = true;
    const movieId = this.route.snapshot.paramMap.get('id');
    
    if (!movieId) {
      this.errorMessage = 'Movie ID is missing.';
      this.isLoading = false;
      return;
    }
    
    this.movieService.getMovieById(movieId).subscribe({
      next: (response) => {
        this.movie = response.data.movie;
        this.isLoading = false;
        this.calculateRatingStats();
        this.checkUserRating();
        // Load comments separately
        this.loadComments();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load movie details.';
        this.isLoading = false;
      }
    });
  }

  calculateRatingStats(): void {
    if (!this.movie || !this.movie.ratings || this.movie.ratings.length === 0) {
      this.ratingStats = [];
      return;
    }
    
    // Initialize stats for ratings 1-5
    const stats = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: 0,
      percentage: 0
    }));
    
    // Count ratings by value
    this.movie.ratings.forEach(rating => {
      const ratingValue = Math.round(rating.rating);
      if (ratingValue >= 1 && ratingValue <= 5) {
        stats[ratingValue - 1].count++;
      }
    });
    
    // Calculate percentages
    const total = this.movie.ratings.length;
    stats.forEach(stat => {
      stat.percentage = Math.round((stat.count / total) * 100);
    });
    
    this.ratingStats = stats;
  }

  checkUserRating(): void {
    if (!this.movie || !this.currentUserValue) return;
    
    const existingRating = this.movie.ratings.find(
      r => {
        if (typeof r.user === 'object' && r.user) {
          return r.user._id === this.currentUserValue?._id;
        }
        return r.user === this.currentUserValue?._id;
      }
    );
    
    if (existingRating) {
      this.userRating = existingRating.rating;
    }
  }

  setRating(rating: number): void {
    if (!this.currentUserValue) return;
    this.userRating = rating;
    this.submitRating();
  }

  submitRating(): void {
    if (!this.movie || !this.authService.isLoggedIn || this.userRating === 0) {
      return;
    }
    
    this.isRatingSubmitting = true;
    
    this.movieService.addRating(this.movie._id, this.userRating).subscribe({
      next: (response) => {
        // Update movie ratings and average
        if (this.movie) {
          this.movie.ratings = response.data.ratings;
          this.movie.averageRating = response.data.averageRating;
          this.calculateRatingStats();
        }
        
        this.isRatingSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to submit rating.';
        this.isRatingSubmitting = false;
      }
    });
  }

  addComment(): void {
    if (!this.movie || !this.authService.isLoggedIn || !this.newComment.trim()) {
      return;
    }
    
    this.isCommentSubmitting = true;
    
    this.movieService.addComment(this.movie._id, this.newComment).subscribe({
      next: (response) => {
        // Reload comments after adding a new one
        this.loadComments();
        this.newComment = ''; // Clear the comment input
        this.isCommentSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to add comment.';
        this.isCommentSubmitting = false;
      }
    });
  }

  loadComments(): void {
    if (!this.movie) return;
    
    this.movieService.getComments(this.movie._id).subscribe({
      next: (response) => {
        if (this.movie && response.data && response.data.comments) {
          this.movie.comments = response.data.comments;
          // Update sorted comments
          this.sortedComments = [...this.movie.comments].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load comments.';
      }
    });
  }

  deleteComment(commentId: string): void {
    if (!this.movie || !this.authService.isLoggedIn) {
      return;
    }
    
    this.commentDeleting = commentId;
    
    this.movieService.deleteComment(this.movie._id, commentId).subscribe({
      next: () => {
        // Reload comments after deletion
        this.loadComments();
        this.commentDeleting = null;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete comment.';
        this.commentDeleting = null;
      }
    });
  }

  canDeleteComment(comment: Comment): boolean {
    if (!this.currentUserValue) return false;
    
    if (typeof comment.user === 'object' && comment.user !== null) {
      return comment.user._id === this.currentUserValue._id || this.currentUserValue.role === 'admin';
    }
    
    return comment.user === this.currentUserValue._id || this.currentUserValue.role === 'admin';
  }

  getUserName(user: any): string {
    if (typeof user === 'object' && user && user.name) {
      return user.name;
    }
    return 'Anonymous User';
  }

  getDirectorName(director: any): string {
    if (typeof director === 'object' && director && director.name) {
      return director.name;
    }
    return String(director) || 'Unknown Director';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      return formatDate(dateString, 'MMM d, y, h:mm a', 'en-US');
    } catch (error) {
      return dateString;
    }
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let result = '';
    if (hours > 0) {
      result = `${hours}h`;
    }
    
    if (remainingMinutes > 0 || hours === 0) {
      result += `${remainingMinutes}m`;
    }
    
    return result;
  }

  getActorRole(actor: any): string {
    return actor && actor.role ? actor.role : 'Actor';
  }

  loadRatingStats(filter: 'age' | 'gender' | 'country'): void {
    this.statFilter = filter;
    this.isLoadingStats = true;
    
    if (!this.movie) return;
    
    this.statsService.getRatingStats().subscribe({
      next: (response) => {
        // Adapt this to the actual structure of your response
        const results = response.data.results || [];
        this.ratingStats = results.map((stat: any) => ({
          rating: stat.ageGroup || stat.gender || stat.country || 'Unknown',
          count: 0, // Default value since count might not be available
          percentage: stat.averageRating * 20 // Convert 0-5 to 0-100%
        })) as RatingStat[];
        this.isLoadingStats = false;
      },
      error: () => {
        this.ratingStats = [];
        this.isLoadingStats = false;
      }
    });
  }

  getStatFieldLabel(): string {
    switch(this.statFilter) {
      case 'age': return 'Age Group';
      case 'gender': return 'Gender';
      case 'country': return 'Country';
      default: return '';
    }
  }

  getCommentContent(comment: Comment): string {
    return comment.content || comment.text || '';
  }
}