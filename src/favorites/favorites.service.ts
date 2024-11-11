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
    return id;
  }

  getTrackIndex(id: string): number {
    return this.favorites.tracks.findIndex((trackId) => trackId === id);
  }

  deleteTrack(trackIndex: number): void {
    if (trackIndex !== -1) this.favorites.tracks.splice(trackIndex, 1);
  }

  addAlbum(id: string): string {
    this.favorites.albums.push(id);
    return id;
  }

  getAlbumIndex(id: string): number {
    return this.favorites.albums.findIndex((albumId) => albumId === id);
  }

  deleteAlbum(albumIndex: number): void {
    if (albumIndex !== -1) this.favorites.albums.splice(albumIndex, 1);
  }

  addArtist(id: string): string {
    this.favorites.artists.push(id);
    return id;
  }

  getArtistIndex(id: string): number {
    return this.favorites.artists.findIndex((artistId) => artistId === id);
  }

  deleteArtist(artistIndex: number): void {
    if (artistIndex !== -1) this.favorites.artists.splice(artistIndex, 1);
  }
}
