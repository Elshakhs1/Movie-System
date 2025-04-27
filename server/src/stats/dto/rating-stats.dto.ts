import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RatingStatsDto {
  @IsString()
  @IsNotEmpty()
  movieId: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['age', 'gender', 'country'])
  groupBy: string;
} 