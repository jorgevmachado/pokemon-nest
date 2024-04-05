import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { User } from './user.entity';

import { CreateUserDto } from './dtos/create-user.dto';
import { ReturnUserDto } from './dtos/return-user.dto';
import { UpdateUserDto } from './dtos/update-users.dto';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

import { UserRoles } from './user-roles.enum';

import { Role } from '../auth/dto/role.decoretor';
import { RolesGuard } from '../auth/role.guards';
import { GetUser } from '../auth/get-user.decorator';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Role(UserRoles.ADMIN)
  @UseGuards(AuthGuard())
  async createAdminUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createAdminUser(createUserDto);
    return {
      user,
      message: 'Administrator successfully registered',
    };
  }

  @Get(':id')
  @Role(UserRoles.ADMIN)
  async findUserById(@Param('id') id: string): Promise<ReturnUserDto> {
    const user = await this.usersService.findUserById(id);
    return {
      user,
      message: 'User found',
    };
  }

  @Patch(':id')
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.role != UserRoles.ADMIN && user.id.toString() != id) {
      throw new ForbiddenException(
        'You are not authorized to access this feature',
      );
    } else {
      return this.usersService.updateUser(updateUserDto, id);
    }
  }

  @Delete(':id')
  @Role(UserRoles.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return {
      message: 'User removed successfully',
    };
  }

  @Get()
  @Role(UserRoles.ADMIN)
  async findUsers(@Query() query: FindUsersQueryDto) {
    const found = await this.usersService.findUsers(query);
    return {
      found,
      message: 'User found',
    };
  }
}
