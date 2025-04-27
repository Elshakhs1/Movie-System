import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../schemas/Movie.schema';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOAD_DESTINATION') || './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix = uuidv4();
            const ext = extname(file.originalname);
            cb(null, `movie-${uniqueSuffix}${ext}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {} 