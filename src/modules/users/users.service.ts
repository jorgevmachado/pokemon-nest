import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-users.dto';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

import { User } from './user.entity';
import { UserRoles } from './user-roles.enum';

import { CredentialsDto } from '../auth/dto/credentials.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords are not the same');
    } else {
      return this.createUser(createUserDto, UserRoles.ADMIN);
    }
  }

  async createUser(
    createUserDto: CreateUserDto,
    role: UserRoles,
  ): Promise<User> {
    const { email, name, password } = createUserDto;
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      const result = await this.repository.save(user);
      delete result.password;
      delete result.salt;
      return result;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Email address is already in use');
      } else {
        throw new InternalServerErrorException('Error saving user to database');
      }
    }
  }

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.repository.findOne({
      where: { email: email, status: true },
    });

    if (user && (await user.checkPassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user = await this.findUserById(id);
    const { name, email, role, status } = updateUserDto;
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    user.status = status === undefined ? user.status : status;
    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error saving data to database');
    }
  }

  async deleteUser(userId: string) {
    const result = await this.repository.delete({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: Array<User>; total: number }> {
    if (!queryDto.page) {
      queryDto.page = 1;
    }

    if (!queryDto.limit) {
      queryDto.limit = 10;
    }
    queryDto.status = queryDto.status === undefined ? true : queryDto.status;
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { email, name, status, role } = queryDto;
    const query = this.repository.createQueryBuilder('user');
    query.where('user.status = :status', { status });

    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    if (name) {
      query.andWhere('user.name LIKE :name', { email: `%${name}%` });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    const skip = (+queryDto.page - 1) * +queryDto.limit;

    query.skip(skip);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.role', 'user.status']);

    const [users, total] = await query.getManyAndCount();
    return { users, total };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
