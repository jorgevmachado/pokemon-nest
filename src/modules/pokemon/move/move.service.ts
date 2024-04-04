import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Service } from '@services/abstract/service/service';
import { IResponsePokemon } from '@api/pokemon';

import { Move } from './move.entity';

@Injectable()
export class MoveService extends Service<Move, IResponsePokemon['moves'][0]> {
  constructor(
    @InjectRepository(Move)
    protected repository: Repository<Move>,
  ) {
    super([], repository);
  }

  transformBefore(response: IResponsePokemon['moves'][0]): Move {
    const entity = new Move();
    entity.url = response.move.url;
    entity.name = response.move.name;
    entity.order = response.move.order;
    entity.createdAt = new Date();
    return entity;
  }

  async generate(response: IResponsePokemon['moves']) {
    return await Promise.all(
      response.map(async (item) => {
        const entity = await this.repository.findOne({
          where: { order: item.move.order },
        });

        if (!entity) {
          return this.save(item, { order: item.move.order });
        }

        return entity;
      }),
    );
  }
}
