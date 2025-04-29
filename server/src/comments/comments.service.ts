import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../schemas/Comment.schema';
import { Movie } from '../schemas/Movie.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  async findByMovieId(movieId: string): Promise<Comment[]> {
    // Check if movie exists
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Find comments for this movie
    return this.commentModel.find({ movieId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(movieId: string, userId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    console.log('Creating comment for movie', movieId, 'by user', userId);
    
    // Check if movie exists
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Create new comment
    const now = new Date();
    const newComment = new this.commentModel({
      movieId,
      userId,
      text: createCommentDto.text,
      createdAt: now,
      updatedAt: now,
    });

    const savedComment = await newComment.save();
    console.log('Comment saved successfully:', savedComment._id);
    
    return savedComment;
  }

  async delete(commentId: string, movieId: string, user: any): Promise<void> {
    console.log('Attempting to delete comment', commentId, 'for movie', movieId, 'by user', user);
    
    // Extract user ID using various possible formats
    const userId = user?.userId || user?.sub || user?._id?.toString();
    const userRole = user?.role || 'user'; // Default to regular user if not specified
    
    if (!userId) {
      console.error('No user ID found in request for comment deletion');
      throw new ForbiddenException('User ID is required');
    }
    
    // Find the comment
    const comment = await this.commentModel.findById(commentId).exec();
    
    // Check if comment exists
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    
    console.log('Found comment:', comment);
    console.log('Comment user ID:', comment.userId?.toString());
    console.log('Request user ID:', userId);
    
    // Check if comment belongs to the movie
    if (comment.movieId.toString() !== movieId) {
      throw new NotFoundException('Comment not found in this movie');
    }
    
    // Check if user is allowed to delete this comment
    const commentUserId = comment.userId?.toString();
    const isAdmin = userRole === 'admin';
    const isCommentAuthor = commentUserId === userId;
    
    console.log('User is admin:', isAdmin);
    console.log('User is comment author:', isCommentAuthor);
    
    if (!isAdmin && !isCommentAuthor) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }
    
    // Delete the comment
    await this.commentModel.findByIdAndDelete(commentId).exec();
    console.log('Comment deleted successfully');
  }
} 