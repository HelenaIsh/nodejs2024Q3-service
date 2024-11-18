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
import { Track } from './track.entity';
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
  async findAll(): Promise<Track[]> {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Track> {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return await this.trackService.findOne(id);
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    const albumId = createTrackDto.albumId;
    const artistId = createTrackDto.artistId;
    if (albumId) {
      if (!isUUID(albumId)) throw new BadRequestException('Invalid UUID');
      try {
        await this.albumService.findOne(albumId);
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
        await this.artistService.findOne(artistId);
      } catch (e) {
        if (isInstance(e, NotFoundException)) {
          throw new HttpException(
            `Artist with id ${artistId} does not exist`,
            422,
          );
        }
      }
    }
    return await this.trackService.create(createTrackDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const albumId = updateTrackDto.albumId;
    const artistId = updateTrackDto.artistId;
    if (albumId) {
      if (!isUUID(albumId)) throw new BadRequestException('Invalid UUID');
      try {
        await this.albumService.findOne(albumId);
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
        await this.artistService.findOne(artistId);
      } catch (e) {
        if (isInstance(e, NotFoundException)) {
          throw new HttpException(
            `Artist with id ${artistId} does not exist`,
            422,
          );
        }
      }
    }
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    await this.trackService.delete(id);
  }
}
