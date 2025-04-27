import { Controller, Get, Query } from '@nestjs/common';
import { StatsService, DemographicStat } from './stats.service';
import { RatingStatsDto } from './dto/rating-stats.dto';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('ratings')
  async getRatingStats(@Query() ratingStatsDto: RatingStatsDto): Promise<{
    status: string;
    data: {
      group: string;
      results: DemographicStat[];
    };
  }> {
    const stats = await this.statsService.getRatingStats(
      ratingStatsDto.movieId,
      ratingStatsDto.groupBy,
    );
    
    return {
      status: 'success',
      data: {
        group: ratingStatsDto.groupBy,
        results: stats,
      },
    };
  }
} 