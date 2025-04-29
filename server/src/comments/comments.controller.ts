import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('movies/:movieId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async findAll(@Param('movieId') movieId: string) {
    const comments = await this.commentsService.findByMovieId(movieId);
    return {
      status: 'success',
      data: {
        comments
      }
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('movieId') movieId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user,
    @Req() request
  ) {
    console.log('Full request user object:', request.user);
    console.log('User from CurrentUser decorator:', user);
    
    // Extract user ID with fallbacks
    let userId;
    
    if (user && user.userId) {
      userId = user.userId;
    } else if (user && user.sub) {
      userId = user.sub;
    } else if (request.user && request.user.userId) {
      userId = request.user.userId;
    } else if (request.user && request.user.sub) {
      userId = request.user.sub;
    } else {
      userId = 'unknown-user';
      console.error('Could not extract user ID from request');
    }
    
    console.log('Using userId:', userId);
    
    const comment = await this.commentsService.create(
      movieId,
      userId,
      createCommentDto,
    );
    
    return {
      status: 'success',
      data: {
        comment
      }
    };
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async delete(
    @Param('movieId') movieId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user,
    @Req() request
  ) {
    // Extract user with fallbacks
    const userInfo = user || request.user || {};
    
    await this.commentsService.delete(commentId, movieId, userInfo);
    return {
      status: 'success',
      message: 'Comment deleted successfully',
    };
  }
} 