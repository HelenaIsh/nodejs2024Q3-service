import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
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

  delete(id: string): void {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1)
      throw new NotFoundException(`Track with id ${id} not found`);
    this.tracks.splice(trackIndex, 1);
  }
}
