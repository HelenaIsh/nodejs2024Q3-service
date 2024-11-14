import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    return { ...album };
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    return await this.albumRepository.save(newAlbum);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.preload({
      id,
      ...updateAlbumDto,
    });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    return await this.albumRepository.save(album);
  }

  async delete(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    this.trackService.deleteAlbum(id);
    this.favoritesService.deleteAlbum(await this.favoritesService.getAlbumIndex(id));
  }

  async deleteArtist(artistId: string): Promise<void> {
    await this.albumRepository.update({ artistId }, { artistId: null });
  }
}
