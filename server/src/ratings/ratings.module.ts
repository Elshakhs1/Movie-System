import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { Rating, RatingSchema } from '../schemas/Rating.schema';
import { Movie, MovieSchema } from '../schemas/Movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {} 