import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { v4 as uuidv4 } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(private readonly favoritesService: FavoritesService) {}
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    return { ...track };
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTackDto: UpdateTrackDto): Track {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    const track = this.tracks[trackIndex];
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    const updatedTrack = { ...track, ...updateTackDto };
    this.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  async delete(id: string): Promise<void> {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1)
      throw new NotFoundException(`Track with id ${id} not found`);
    await this.favoritesService.deleteTrack(await this.favoritesService.getTrackIndex(id));
    this.tracks.splice(trackIndex, 1);
  }

  deleteAlbum(albumId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.albumId !== albumId ? track : { ...track, albumId: null },
    );
  }

  deleteArtist(artistId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.artistId !== artistId ? track : { ...track, artistId: null },
    );
  }
}
