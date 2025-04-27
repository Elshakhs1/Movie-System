import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('movies/:movieId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('movieId') movieId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user,
  ) {
    const comment = await this.commentsService.create(
      movieId,
      user.userId,
      createCommentDto,
    );
    
    return {
      status: 'success',
      data: comment,
    };
  }
} 