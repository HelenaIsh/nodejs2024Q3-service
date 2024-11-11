import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  BadRequestException,
  HttpCode,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './interfaces/track.interface';
import { isUUID, isInstance } from 'class-validator';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  findAll(): Track[] {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Track {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.trackService.findOne(id);
  }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto): Track {
    const albumId = createTrackDto.albumId;
    const artistId = createTrackDto.artistId;
    if (albumId) {
      if (!isUUID(albumId)) throw new BadRequestException('Invalid UUID');
      try {
        this.albumService.findOne(albumId);
      } catch (e) {
        if (isInstance(e, NotFoundException)) {
          throw new HttpException(
            `Album with id ${albumId} does not exist`,
            422,
          );
        }
      }
    }
    if (artistId) {
      if (!isUUID(artistId)) throw new BadRequestException('Invalid UUID');
      try {
        this.artistService.findOne(artistId);
      } catch (e) {
        if (isInstance(e, NotFoundException)) {
          throw new HttpException(
            `Artist with id ${artistId} does not exist`,
            422,
          );
        }
      }
    }
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Track {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const albumId = updateTrackDto.albumId;
    const artistId = updateTrackDto.artistId;
    if (albumId) {
      if (!isUUID(albumId)) throw new BadRequestException('Invalid UUID');
      try {
        this.albumService.findOne(albumId);
      } catch (e) {
        if (isInstance(e, NotFoundException)) {
          throw new HttpException(
            `Album with id ${albumId} does not exist`,
            422,
          );
        }
      }
    }
    if (artistId) {
      if (!isUUID(artistId)) throw new BadRequestException('Invalid UUID');
      try {
        this.artistService.findOne(artistId);
      } catch (e) {
        if (isInstance(e, NotFoundException)) {
          throw new HttpException(
            `Artist with id ${artistId} does not exist`,
            422,
          );
        }
      }
    }
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    this.trackService.delete(id);
  }
}
