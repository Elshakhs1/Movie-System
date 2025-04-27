import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { QueryMovieDto } from './dto/query-movie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';

// Change this from Express to actual file type
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  async findAll(@Query() queryMovieDto: QueryMovieDto) {
    const result = await this.moviesService.findAll(queryMovieDto);
    return {
      status: 'success',
      data: result,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() createMovieDto: CreateMovieDto) {
    const movie = await this.moviesService.create(createMovieDto);
    return {
      status: 'success',
      data: movie,
    };
  }

  @Post(':id/poster')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('poster'))
  async uploadPoster(
    @Param('id') id: string,
    @UploadedFile() file: MulterFile,
  ) {
    const posterUrl = await this.moviesService.uploadPoster(id, file);
    return {
      status: 'success',
      data: { posterUrl },
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    await this.moviesService.delete(id);
    return {
      status: 'success',
      message: 'Movie deleted successfully',
    };
  }
} 