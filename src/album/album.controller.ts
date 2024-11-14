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
import { Album } from './album.entity';
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
  async findAll(): Promise<Album[]> {
    return await this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Album> {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return await this.albumService.findOne(id);
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    const artistId = createAlbumDto.artistId;
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
    return await this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const artistId = updateAlbumDto.artistId;
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
    return await this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    await this.albumService.delete(id);
  }
}
