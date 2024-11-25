import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorites } from './favorites.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
  ) {}

  private async getFavorites(): Promise<Favorites> {
    const favorites = await this.favoritesRepository.find();
    if (!favorites[0]) {
      favorites[0] = this.favoritesRepository.create();
      await this.favoritesRepository.save(favorites);
    }
    return favorites[0];
  }

  async findAll() {
    return await this.getFavorites();
  }

  async addTrack(id: string): Promise<string> {
    const favorites = await this.getFavorites();
    favorites.tracks.push(id);
    await this.favoritesRepository.save(favorites);
    return `Track with id:${id} was added to favorites`;
  }

  async getTrackIndex(id: string): Promise<number> {
    const favorites = await this.getFavorites();
    const trackIndex = favorites.tracks.findIndex((trackId) => trackId === id);
    return trackIndex;
  }

  async deleteTrack(trackIndex: number): Promise<string> {
    const favorites = await this.getFavorites();
    favorites.tracks.splice(trackIndex, 1);
    await this.favoritesRepository.save(favorites);
    return `Track with id:${trackIndex} was deleted from favorites`;
  }

  async addAlbum(id: string): Promise<string> {
    const favorites = await this.getFavorites();
    favorites.albums.push(id);
    await this.favoritesRepository.save(favorites);
    return `Album with id:${id} was added to favorites`;
  }

  async getAlbumIndex(id: string): Promise<number> {
    const favorites = await this.getFavorites();
    const albumIndex = favorites.albums.findIndex((albumId) => albumId === id);
    return albumIndex;
  }

  async deleteAlbum(albumIndex: number): Promise<string> {
    const favorites = await this.getFavorites();
    favorites.albums.splice(albumIndex, 1);
    await this.favoritesRepository.save(favorites);
    return `Album with id:${albumIndex} was deleted from favorites`;
  }

  async addArtist(id: string): Promise<string> {
    const favorites = await this.getFavorites();
    favorites.artists.push(id);
    await this.favoritesRepository.save(favorites);
    return `Artist with id:${id} was added to favorites`;
  }

  async getArtistIndex(id: string): Promise<number> {
    const favorites = await this.getFavorites();
    const artistIndex = favorites.artists.findIndex(
      (artistId) => artistId === id,
    );
    return artistIndex;
  }

  async deleteArtist(artyistIndex: number): Promise<string> {
    const favorites = await this.getFavorites();
    favorites.artists.splice(artyistIndex, 1);
    await this.favoritesRepository.save(favorites);
    return `Artist with id:${artyistIndex} was deleted from favorites`;
  }
}
