export interface Rating {
  _id?: string;
  movieId: string;
  userId: string;
  score: number;
  createdAt: Date;
}

export interface CreateRatingRequest {
  score: number;
}

export interface RatingResponse {
  status: string;
  data: Rating;
}

export interface RatingStatResponse {
  status: string;
  data: {
    group: string;
    results: Array<{
      ageGroup?: string;
      gender?: string;
      country?: string;
      averageRating: number;
    }>;
  };
} 