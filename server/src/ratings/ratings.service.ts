import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from '../schemas/Rating.schema';
import { Movie } from '../schemas/Movie.schema';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
  ) {}

  async create(movieId: string, userId: string, createRatingDto: CreateRatingDto): Promise<Rating> {
    // Check if movie exists
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Check if user already rated this movie
    const existingRating = await this.ratingModel.findOne({
      movieId,
      userId,
    }).exec();

    if (existingRating) {
      throw new BadRequestException('You have already rated this movie');
    }

    // Create new rating
    const newRating = new this.ratingModel({
      movieId,
      userId,
      score: createRatingDto.score,
      createdAt: new Date(),
    });

    await newRating.save();

    // Update movie's average rating
    await this.updateMovieAverageRating(movieId);

    return newRating;
  }

  private async updateMovieAverageRating(movieId: string): Promise<void> {
    const ratings = await this.ratingModel.find({ movieId }).exec();
    
    if (ratings.length === 0) {
      return;
    }
    
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    const averageRating = totalScore / ratings.length;
    
    await this.movieModel.findByIdAndUpdate(
      movieId,
      { averageRating: parseFloat(averageRating.toFixed(1)) },
    ).exec();
  }
} 