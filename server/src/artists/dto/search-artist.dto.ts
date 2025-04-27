import { IsOptional, IsString } from 'class-validator';

export class SearchArtistDto {
  @IsString()
  @IsOptional()
  search?: string;
} 