import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(movieId: string, userId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
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

    return await newComment.save();
  }
} 