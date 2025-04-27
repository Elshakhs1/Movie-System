import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from '../schemas/Artist.schema';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {} 