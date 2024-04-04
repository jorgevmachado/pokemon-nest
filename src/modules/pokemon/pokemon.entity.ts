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
}
