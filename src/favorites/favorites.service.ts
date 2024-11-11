import { Injectable } from '@nestjs/common';
import { Favorites } from './interfaces/favorites.interface';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = { artists: [], albums: [], tracks: [] };

  findAll(): Favorites {
    return this.favorites;
  }

  addTrack(id: string): string {
    this.favorites.tracks.push(id);
    return `Track with id:${id} was added to favorites`;
  }

  getTrackIndex(id: string): number {
    return this.favorites.tracks.findIndex((trackId) => trackId === id);
  }

  deleteTrack(trackIndex: number): string {
    if (trackIndex !== -1) this.favorites.tracks.splice(trackIndex, 1);
    return `Track with  was deleted from favorites`;
  }

  addAlbum(id: string): string {
    this.favorites.albums.push(id);
    return `Album with id:${id} was added to favorites`;
  }

  getAlbumIndex(id: string): number {
    return this.favorites.albums.findIndex((albumId) => albumId === id);
  }

  deleteAlbum(albumIndex: number): string {
    if (albumIndex !== -1) this.favorites.albums.splice(albumIndex, 1);
    return `Album with  was deleted from favorites`;
  }

  addArtist(id: string): string {
    this.favorites.artists.push(id);
    return `Artist with id:${id} was added to favorites`;
  }

  getArtistIndex(id: string): number {
    return this.favorites.artists.findIndex((artistId) => artistId === id);
  }

  deleteArtist(artistIndex: number): string {
    if (artistIndex !== -1) this.favorites.artists.splice(artistIndex, 1);
    return `Artist with  was deleted from favorites`;
  }
}
