import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IResponsePokemon } from '@api/pokemon';
import { Service } from '@services/abstract/service/service';

import { Type } from './type.entity';
import { TYPE_COLORS } from './type.constant';

@Injectable()
export class TypeService extends Service<Type, IResponsePokemon['types'][0]> {
  constructor(
    @InjectRepository(Type)
    protected repository: Repository<Type>,
  ) {
    super([], repository);
  }

  transformBefore(response: IResponsePokemon['types'][0]): Type {
    const entity = new Type();
    const typeColor = TYPE_COLORS.find(
      (color) => color.name === response.type.name,
    );
    entity.url = response.type.url;
    entity.name = response.type.name;
    entity.order = response.type.order;
    entity.textColor = !typeColor ? '#FFF' : typeColor.textColor;
    entity.backgroundColor = !typeColor ? '#000' : typeColor.backgroundColor;
    return entity;
  }

  async generate(response: IResponsePokemon['types']) {
    return await Promise.all(
      response.map(async (item) => {
        const entity = await this.repository.findOne({
          where: { order: item.type.order },
        });
        if (!entity) {
          return await this.save(item, { order: item.type.order });
        }
        return entity;
      }),
    );
  }
}
