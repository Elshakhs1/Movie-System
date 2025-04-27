import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateArtistDto } from './dto/create-artist.dto';
import { SearchArtistDto } from './dto/search-artist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get()
  async findAll(@Query() searchArtistDto: SearchArtistDto) {
    const artists = await this.artistsService.findAll(searchArtistDto);
    return {
      status: 'success',
      data: artists,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() createArtistDto: CreateArtistDto) {
    const artist = await this.artistsService.create(createArtistDto);
    return {
      status: 'success',
      data: artist,
    };
  }
} 