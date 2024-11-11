import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
  ) {}
  private albums: Album[] = [];

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    return { ...album };
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    const album = this.albums[albumIndex];
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    const updatedAlbum = { ...album, ...updateAlbumDto };
    this.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  delete(id: string): void {
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1)
      throw new NotFoundException(`Album with id ${id} not found`);
    this.trackService.deleteAlbum(id);
    this.favoritesService.deleteAlbum(this.favoritesService.getAlbumIndex(id));
    this.albums.splice(albumIndex, 1);
  }

  deleteArtist(artistId: string): void {
    this.albums = this.albums.map((album) =>
      album.artistId !== artistId ? album : { ...album, artistId: null },
    );
  }
}
