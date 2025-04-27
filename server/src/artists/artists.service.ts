import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist } from '../schemas/Artist.schema';
import { CreateArtistDto } from './dto/create-artist.dto';
import { SearchArtistDto } from './dto/search-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<Artist>,
  ) {}

  async findAll(searchArtistDto: SearchArtistDto): Promise<Artist[]> {
    const { search } = searchArtistDto;
    const filter: any = {};

    if (search) {
      filter.$text = { $search: search };
    }

    return this.artistModel.find(filter).exec();
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = new this.artistModel({
      ...createArtistDto,
      dateOfBirth: new Date(), // This should be part of the DTO in a real application
      nationality: 'Unknown', // This should be part of the DTO in a real application
    });

    return await newArtist.save();
  }
} 