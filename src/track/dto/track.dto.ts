import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  artistId: string;

  @IsString()
  albumId: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  artistId: string;

  @IsString()
  albumId: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
