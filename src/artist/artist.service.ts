import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly favoritesService: FavoritesService,
  ) {}

  private artists: Artist[] = [];

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return { ...artist };
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    const artist = this.artists[artistIndex];
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    const updatedArtist = { ...artist, ...updateArtistDto };
    this.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  delete(id: string): void {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1)
      throw new NotFoundException(`Artist with id ${id} not found`);
    this.albumService.deleteArtist(id);
    this.favoritesService.deleteArtist(
      this.favoritesService.getArtistIndex(id),
    );
    this.trackService.deleteArtist(id);
    this.artists.splice(artistIndex, 1);
  }
}
