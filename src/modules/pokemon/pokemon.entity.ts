import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { IResponsePokemon, IResponseSpecie } from '@api/pokemon';

import type { IPokemon } from './pokemon.interface';
import { Type } from './type';
import { Stat } from './stat';
import { Move } from './move';
import { Ability } from './ability';

@Entity()
export class Pokemon
  extends BaseEntity
  implements Omit<IPokemon, 'types' | 'stats' | 'moves' | 'abilities'>
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false })
  order: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  color: string;

  @ManyToMany(() => Move, { nullable: true })
  @JoinTable()
  moves: Array<Move>;

  @ManyToMany(() => Stat, { nullable: true })
  @JoinTable()
  stats: Array<Stat>;

  @ManyToMany(() => Type, { nullable: true })
  @JoinTable()
  types: Array<Type>;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  image: string;

  @Column({ nullable: false })
  height: number;

  @Column({ nullable: false })
  weight: number;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  habitat?: string;

  @Column({ nullable: false })
  is_baby: boolean;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  shape_url: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  shape_name: string;

  @ManyToMany(() => Ability, { nullable: true })
  @JoinTable()
  abilities: Array<Ability>;

  @Column({ nullable: false })
  is_mythical: boolean;

  @Column({ nullable: false })
  gender_rate: number;

  @Column({ nullable: false })
  is_legendary: boolean;

  @Column({ nullable: false })
  capture_rate: number;

  @Column({ nullable: false })
  hatch_counter: number;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  cries_latest?: string;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  cries_legacy?: string;

  @Column({ nullable: false })
  base_happiness: number;

  @Column({ nullable: false })
  base_experience: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  evolution_chain_url: string;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  evolves_from_species?: string;

  @Column({ nullable: false })
  has_gender_differences: boolean;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  location_area_encounters: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  static responseToEntity(
    response: IResponsePokemon,
    responseSpecie: IResponseSpecie,
  ): Pokemon {
    const entity = new Pokemon();
    entity.name = response.name;
    entity.order = response.order;
    entity.color = responseSpecie.color.name;
    entity.height = response.height;
    entity.weight = response.weight;
    entity.habitat = responseSpecie.habitat
      ? responseSpecie.habitat.name
      : null;
    entity.is_baby = responseSpecie.is_baby;
    entity.shape_url = responseSpecie.shape.url;
    entity.shape_name = responseSpecie.shape.name;
    entity.is_mythical = responseSpecie.is_mythical;
    entity.gender_rate = responseSpecie.gender_rate;
    entity.is_legendary = responseSpecie.is_legendary;
    entity.capture_rate = responseSpecie.capture_rate;
    entity.hatch_counter = responseSpecie.hatch_counter;
    entity.cries_latest = response.cries.latest;
    entity.cries_legacy = response.cries.legacy;
    entity.base_happiness = responseSpecie.base_happiness;
    entity.base_experience = response.base_experience;
    entity.evolution_chain_url = responseSpecie.evolution_chain.url;
    entity.evolves_from_species = responseSpecie.evolves_from_species
      ? responseSpecie.evolves_from_species.name
      : null;
    entity.has_gender_differences = responseSpecie.has_gender_differences;
    entity.location_area_encounters = response.location_area_encounters;
    entity.createdAt = new Date();
    return entity;
  }
}
