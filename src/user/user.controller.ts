import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';
import { isUUID } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): User {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    this.userService.delete(id);
  }
}
