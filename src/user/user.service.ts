import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: ['id', 'login', 'version', 'createdAt', 'updatedAt'],
    });
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return { ...user, password: undefined };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.userRepository.save(newUser);
    return { ...newUser, password: undefined };
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (user.password !== updatePasswordDto.oldPassword)
      throw new ForbiddenException('Old password is incorrect');

    const newUser = await this.userRepository.preload({
      id,
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
      createdAt: +user.createdAt,
      updatedAt: Date.now(),
    });
    await this.userRepository.save(newUser);
    return { ...newUser, password: undefined };
  }

  async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
