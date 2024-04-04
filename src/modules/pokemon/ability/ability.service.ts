import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Service } from '@services/abstract/service/service';
import { IResponsePokemon } from '@api/pokemon';

import { Ability } from './ability.entity';
import { response } from 'express';

@Injectable()
export class AbilityService extends Service<
  Ability,
  IResponsePokemon['abilities'][0]
> {
  constructor(
    @InjectRepository(Ability)
    protected repository: Repository<Ability>,
  ) {
    super([], repository);
  }

  transformBefore(response: IResponsePokemon['abilities'][0]): Ability {
    const entity = new Ability();
    entity.url = response.ability.url;
    entity.name = response.ability.name;
    entity.slot = response.slot;
    entity.order = response.ability.order;
    entity.is_hidden = response.is_hidden;
    entity.createdAt = new Date();
    return entity;
  }

  async generate(response: IResponsePokemon['abilities']) {
    return await Promise.all(
      response.map(async (item) => {
        const entity = await this.repository.findOne({
          where: { order: item.ability.order },
        });

        if (!entity) {
          return this.save(item, { order: item.ability.order });
        }

        return entity;
      }),
    );
  }
}
