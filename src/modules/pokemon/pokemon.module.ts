import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonBaseModule } from './base';
import { StatModule } from './stat';
import { TypeModule } from './type';
import { MoveModule } from './move';
import { AbilityModule } from './ability';

import { Pokemon } from './pokemon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PokemonBaseModule,
    StatModule,
    TypeModule,
    StatModule,
    MoveModule,
    MoveModule,
    AbilityModule,
  ],
  providers: [PokemonService],
  exports: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
