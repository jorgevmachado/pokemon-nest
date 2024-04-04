import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeService } from './type.service';
import { Type } from './type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Type])],
  providers: [TypeService],
  exports: [TypeService],
})
export class TypeModule {}
