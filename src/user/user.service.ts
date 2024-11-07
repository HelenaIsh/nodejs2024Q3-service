import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users.map((user) => ({ ...user, password: undefined }));
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return { ...user, password: undefined };
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return { ...newUser, password: undefined };
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    if (user.password !== updatePasswordDto.oldPassword)
      throw new ForbiddenException('Old password is incorrect');
    user.password = updatePasswordDto.newPassword;
    user.version++;
    user.updatedAt = Date.now();
    return { ...user, password: undefined };
  }

  delete(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1)
      throw new NotFoundException(`User with id ${id} not found`);
    this.users.splice(index, 1);
  }
}
