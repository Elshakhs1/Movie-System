import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../schemas/Movie.schema';
import { QueryMovieDto } from './dto/query-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ConfigService } from '@nestjs/config';

// Add MulterFile type
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

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    private configService: ConfigService,
  ) {}

  async findAll(queryMovieDto: QueryMovieDto) {
    const { page = 1, limit = 10, searchTerm, genre, year } = queryMovieDto;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};
    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }
    if (genre) {
      filter.genres = genre;
    }
    if (year) {
      filter.releaseYear = year;
    }

    // Execute query
    const [movies, total] = await Promise.all([
      this.movieModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate('director', 'name')
        .populate('artists', 'name')
        .exec(),
      this.movieModel.countDocuments(filter).exec(),
    ]);

    return {
      movies,
      total,
      page,
    };
  }

  async findById(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id)
      .populate('director', 'name bio')
      .populate('artists', 'name bio')
      .populate({
        path: 'ratings',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'name email'
        },
        options: { sort: { createdAt: -1 } }
      })
      .exec();
    
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { directorId, artistIds, ...movieData } = createMovieDto;
    
    const newMovie = new this.movieModel({
      ...movieData,
      director: directorId,
      artists: artistIds,
      averageRating: 0,
      posterUrl: 'default-poster.jpg', // Default poster until one is uploaded
    });

    return await newMovie.save();
  }

  async uploadPoster(id: string, file: MulterFile): Promise<string> {
    const movie = await this.findById(id);
    
    // Set poster URL (could be a relative path or full URL depending on your setup)
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const posterUrl = `${baseUrl}/uploads/${file.filename}`;
    
    movie.posterUrl = posterUrl;
    await movie.save();
    
    return posterUrl;
  }

  async delete(id: string): Promise<void> {
    const result = await this.movieModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Movie not found');
    }
  }
} 