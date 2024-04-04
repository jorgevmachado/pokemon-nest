import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PokemonBase } from './pokemon-base.entity';
import { PokemonBaseService } from './pokemon-base.service';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonBase])],
  providers: [PokemonBaseService],
  exports: [PokemonBaseService],
})
export class PokemonBaseModule {}
