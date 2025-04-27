export interface Comment {
  _id?: string;
  movieId: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentRequest {
  text: string;
}

export interface CommentResponse {
  status: string;
  data: Comment;
} 