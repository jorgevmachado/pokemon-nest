import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../auth/role.guards';
import { Role } from '../auth/dto/role.decoretor';

import { BaseQueryParametersDto } from '../../shared/dto/base-query-parameters.dto';

import { PokemonService } from './pokemon.service';

import { UserRoles } from '../users/user-roles.enum';

@Controller('pokemons')
@UseGuards(AuthGuard(), RolesGuard)
export class PokemonController {
  constructor(private service: PokemonService) {}

  @Get('generate')
  @Role(UserRoles.ADMIN)
  @UseGuards(AuthGuard())
  async generate() {
    return this.service.generate();
  }

  @Get(':param')
  @Role(UserRoles.ADMIN)
  show(@Param('param') param: string) {
    return this.service.show(param);
  }

  @Get()
  @Role(UserRoles.ADMIN)
  index(@Query() query: BaseQueryParametersDto) {
    query.page = +query.page || 0;
    query.limit = +query.limit || 0;
    return this.service.index(query);
  }
}
