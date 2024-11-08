import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorites } from './interfaces/favorites.interface';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly trackService: TrackService) {}

  private favorites: Favorites = { artists: [], albums: [], tracks: [] };

  findAll(): Favorites {
    return this.favorites;
  }

  addTrack(id: string): string {
    this.favorites.tracks.push(id);
    return id;
  }

  deleteTrack(id: string): void {
    const trackIndex = this.favorites.tracks.findIndex(
      (trackId) => trackId === id,
    );
    if (trackIndex === -1)
      throw new NotFoundException(`Track with id ${id} not found`);
    this.favorites.tracks.splice(trackIndex, 1);
  }

  addAlbum(id: string): string {
    this.favorites.albums.push(id);
    return id;
  }

  deleteAlbum(id: string): void {
    const albumIndex = this.favorites.albums.findIndex(
      (albumId) => albumId === id,
    );
    if (albumIndex === -1)
      throw new NotFoundException(`Album with id ${id} not found`);
    this.favorites.tracks.splice(albumIndex, 1);
  }

  addArtist(id: string): string {
    this.favorites.artists.push(id);
    return id;
  }

  deleteArtist(id: string): void {
    const artistIndex = this.favorites.artists.findIndex(
      (artistId) => artistId === id,
    );
    if (artistIndex === -1)
      throw new NotFoundException(`Artist with id ${id} not found`);
    this.favorites.tracks.splice(artistIndex, 1);
  }
}
