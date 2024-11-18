import { Module, forwardRef } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from './favorites.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorites]),
    forwardRef(() => TrackModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => ArtistModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
