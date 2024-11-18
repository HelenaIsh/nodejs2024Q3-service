import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly favoritesService: FavoritesService,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return { ...artist };
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    return await this.artistRepository.save(newArtist);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.preload({
      id,
      ...updateArtistDto,
    });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return await this.artistRepository.save(artist);
  }

  async delete(id: string): Promise<void> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
    await this.albumService.deleteArtist(id);
    await this.favoritesService.deleteArtist(
      await this.favoritesService.getArtistIndex(id),
    );
    this.trackService.deleteArtist(id);
  }
}
