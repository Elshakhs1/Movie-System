import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  genres: string[];

  @IsString()
  @IsNotEmpty()
  directorId: string;

  @IsArray()
  artistIds: string[];
} 