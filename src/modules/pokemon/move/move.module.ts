import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MoveService } from './move.service';
import { Move } from './move.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Move])],
  providers: [MoveService],
  exports: [MoveService],
})
export class MoveModule {}
