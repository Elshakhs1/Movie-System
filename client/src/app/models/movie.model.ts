import { Artist } from './artist.model';

export interface Movie {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  genres: string[];
  duration: number;
  posterUrl?: string;
  director?: Artist | string;
  cast: Artist[];
  ratings: Rating[];
  comments: Comment[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface MovieArtist {
  _id: string;
  name: string;
  birthDate?: string;
  biography?: string;
  photoUrl?: string;
  country?: string;
  role?: string;
}

export interface Rating {
  _id: string;
  rating: number;
  user: any; // Can be either User object or string ID
  movie: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  user: any; // Can be either User object or string ID
  movie: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovieResponse {
  success: boolean;
  data: {
    movie: Movie;
  };
}

export interface MoviesResponse {
  success: boolean;
  data: {
    movies: Movie[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface RatingResponse {
  success: boolean;
  data: {
    ratings: Rating[];
    averageRating: number;
  };
}

export interface CommentResponse {
  success: boolean;
  data: {
    comments: Comment[];
  };
}

export interface MovieFilters {
  search?: string;
  genres?: string[];
  releaseYear?: number;
  minRating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateMovieRequest {
  title: string;
  releaseYear: number;
  description: string;
  genres: string[];
  directorId: string;
  artistIds: string[];
}

export interface MovieQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  genre?: string;
  year?: number;
} 