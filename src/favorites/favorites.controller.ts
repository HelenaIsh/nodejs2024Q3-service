import {
  Controller,
  Get,
  Param,
  BadRequestException,
  Post,
  Delete,
  NotFoundException,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { TrackService } from 'src/track/track.service';
import { isInstance, isUUID } from 'class-validator';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Album } from 'src/album/album.entity';
import { Track } from 'src/track/interfaces/track.interface';
import { Artist } from 'src/artist/artist.entity';

@Controller('favs')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  async findAll(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    const favs = this.favoritesService.findAll();
    const artists = await Promise.all(
      favs.artists.map((artistId) => this.artistService.findOne(artistId)),
    );
    const albums = await Promise.all(
      favs.albums.map((albumId) => this.albumService.findOne(albumId)),
    );
    return {
      artists,
      albums,
      tracks: favs.tracks.map((trackId) => this.trackService.findOne(trackId)),
    };
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string): string {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    try {
      this.trackService.findOne(id);
    } catch (e) {
      if (isInstance(e, NotFoundException)) {
        throw new HttpException(`Track with id ${id} does not exist`, 422);
      }
    }
    const trackIndex = this.favoritesService.getTrackIndex(id);
    if (trackIndex === -1) return this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrack(@Param('id') id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const trackIndex = this.favoritesService.getTrackIndex(id);
    if (trackIndex === -1)
      throw new NotFoundException(`Track with id ${id} not found`);
    this.favoritesService.deleteTrack(trackIndex);
  }

  @Post('album/:id')
  async addAlbum(@Param('id') id: string): Promise<string> {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    try {
      await this.albumService.findOne(id);
    } catch (e) {
      if (isInstance(e, NotFoundException)) {
        throw new HttpException(`Album with id ${id} does not exist`, 422);
      }
    }
    const albumIndex = this.favoritesService.getAlbumIndex(id);
    if (albumIndex === -1) return this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbum(@Param('id') id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const albumIndex = this.favoritesService.getAlbumIndex(id);
    if (albumIndex === -1)
      throw new NotFoundException(`Album with id ${id} not found`);
    this.favoritesService.deleteAlbum(albumIndex);
  }

  @Post('artist/:id')
  async addArtist(@Param('id') id: string): Promise<string> {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    try {
      await this.artistService.findOne(id);
    } catch (e) {
      if (isInstance(e, NotFoundException)) {
        throw new HttpException(`Artist with id ${id} does not exist`, 422);
      }
    }
    const artistIndex = this.favoritesService.getArtistIndex(id);
    if (artistIndex === -1) return this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtist(@Param('id') id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const artistIndex = this.favoritesService.getArtistIndex(id);
    if (artistIndex === -1)
      throw new NotFoundException(`Artist with id ${id} not found`);
    this.favoritesService.deleteArtist(artistIndex);
  }
}
