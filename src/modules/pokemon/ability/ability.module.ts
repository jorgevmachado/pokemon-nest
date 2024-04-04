import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityService } from './ability.service';
import { Ability } from './ability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ability])],
  providers: [AbilityService],
  exports: [AbilityService],
})
export class AbilityModule {}
