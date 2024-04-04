import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { type IResponsePokemon } from '@api/pokemon';
import { Service } from '@services/abstract/service/service';

import { Stat } from './stat.entity';

@Injectable()
export class StatService extends Service<Stat, IResponsePokemon['stats'][0]> {
  constructor(
    @InjectRepository(Stat)
    protected repository: Repository<Stat>,
  ) {
    super([], repository);
  }

  transformBefore(response: IResponsePokemon['stats'][0]): Stat {
    const entity = new Stat();
    entity.url = response.stat.url;
    entity.name = response.stat.name;
    entity.order = response.stat.order;
    entity.effort = response.effort;
    entity.base_stat = response.base_stat;
    entity.createdAt = new Date();
    return entity;
  }

  async generate(response: IResponsePokemon['stats']) {
    return await Promise.all(
      response.map(async (item) => {
        const entity = await this.repository.findOne({
          where: { order: item.stat.order },
        });

        if (!entity) {
          return this.save(item, { order: item.stat.order });
        }

        return entity;
      }),
    );
  }
}
