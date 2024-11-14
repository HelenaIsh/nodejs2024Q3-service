import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './track.entity';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { v4 as uuidv4 } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    private readonly favoritesService: FavoritesService,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,) {
  }

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    const track =  await this.trackRepository.findOne({ where: { id } });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    return { ...track };
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    return await this.trackRepository.save(newTrack);
  }

  async update(id: string, updateTackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackRepository.preload({
      id,
      ...updateTackDto,
    });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    return await this.trackRepository.save(track);
  }

  async delete(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    await this.favoritesService.deleteTrack(await this.favoritesService.getTrackIndex(id));
  }

  async deleteAlbum(albumId: string): Promise<void> {
    await this.trackRepository.update({ albumId }, { albumId: null });

  }

  async deleteArtist(artistId: string): Promise<void> {
    await this.trackRepository.update({ artistId }, { artistId: null });
  }
}
