import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Rating, RatingSchema } from '../schemas/Rating.schema';
import { User, UserSchema } from '../schemas/User.schema';
import { Movie, MovieSchema } from '../schemas/Movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: User.name, schema: UserSchema },
      { name: Movie.name, schema: MovieSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {} 