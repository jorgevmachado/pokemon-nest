import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatService } from './stat.service';

import { Stat } from './stat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stat])],
  providers: [StatService],
  exports: [StatService],
})
export class StatModule {}
