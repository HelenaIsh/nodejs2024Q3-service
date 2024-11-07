import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { isUUID } from 'class-validator';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

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
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Album {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    this.albumService.delete(id);
  }
}
