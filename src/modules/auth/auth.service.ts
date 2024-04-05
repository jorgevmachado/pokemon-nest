import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserRoles } from '../users/user-roles.enum';

import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    }
    return this.userService.createUser(createUserDto, UserRoles.USER);
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userService.checkCredentials(credentialsDto);

    if (user === null) {
      throw new UnprocessableEntityException('Credenciais inválidas');
    }

    const jwtPayload = { id: user.id };

    const token = this.jwtService.sign(jwtPayload);

    return { token };
  }
}
