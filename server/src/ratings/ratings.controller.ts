import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('movies/:movieId/ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('movieId') movieId: string,
    @Body() createRatingDto: CreateRatingDto,
    @CurrentUser() user,
  ) {
    const rating = await this.ratingsService.create(
      movieId,
      user.userId,
      createRatingDto,
    );
    
    return {
      status: 'success',
      data: rating,
    };
  }
} 