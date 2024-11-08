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
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { isUUID, isInstance } from 'class-validator';
import { ArtistService } from 'src/artist/artist.service';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  findAll(): Album[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Album {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.albumService.findOne(id);
  }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    const artistId = createAlbumDto.artistId;
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
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Album {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const artistId = updateAlbumDto.artistId;
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
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    this.albumService.delete(id);
  }
}
