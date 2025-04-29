import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MovieService } from '../services/movie.service';
import { CommentService } from '../services/comment.service';
import { RatingService } from '../services/rating.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, HttpClientModule, DatePipe]
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  comments: any[] = [];
  userProfile: any;
  userRating: number = 0;
  
  isLoading = false;
  isLoadingComments = false;
  isRatingSubmitting = false;
  isSubmittingComment = false;
  
  errorMessage = '';
  commentForm: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private commentService: CommentService,
    private ratingService: RatingService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.userProfile = user;
    });
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMovie(id);
        this.loadComments(id);
      }
    });
  }

  loadMovie(id: string): void {
    this.isLoading = true;
    this.movieService.getMovieById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.movie = response.data.movie;
        } else {
          this.errorMessage = response.message || 'Failed to load movie';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred';
      }
    });
  }

  loadComments(movieId: string): void {
    this.isLoadingComments = true;
    this.commentService.getMovieComments(movieId).subscribe({
      next: (response) => {
        this.isLoadingComments = false;
        if (response.status === 'success') {
          this.comments = response.data.comments;
        } else if (response.success) {
          this.comments = response.data.comments || [];
        }
      },
      error: (error) => {
        this.isLoadingComments = false;
        console.error('Error loading comments:', error);
      }
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid) {
      return;
    }
    
    this.isSubmittingComment = true;
    const commentText = this.commentForm.get('comment')?.value;
    
    this.commentService.addComment(this.movie._id, { text: commentText }).subscribe({
      next: (response) => {
        this.isSubmittingComment = false;
        if (response.status === 'success' || response.success) {
          this.commentForm.reset();
          this.loadComments(this.movie._id);
        }
      },
      error: (error) => {
        this.isSubmittingComment = false;
        console.error('Error submitting comment:', error);
      }
    });
  }
  
  deleteComment(commentId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(this.movie._id, commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(comment => comment._id !== commentId);
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
        }
      });
    }
  }
  
  submitRating(score: number): void {
    this.isRatingSubmitting = true;
    
    this.ratingService.rateMovie(this.movie._id, { score }).subscribe({
      next: (response) => {
        this.isRatingSubmitting = false;
        if (response.status === 'success' || response.success) {
          this.userRating = score;
          
          // Refresh movie to update average rating
          this.loadMovie(this.movie._id);
        }
      },
      error: (error) => {
        this.isRatingSubmitting = false;
        console.error('Error submitting rating:', error);
      }
    });
  }
} 