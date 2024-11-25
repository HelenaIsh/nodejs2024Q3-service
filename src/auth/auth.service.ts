import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ id: string; message: string }> {
    const { login, password } = signupDto;

    const existingUser = await this.userRepository.findOne({
      where: { login },
    });
    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = uuidv4();

    const newUser = this.userRepository.create({
      id,
      login,
      password: hashedPassword,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await this.userRepository.save(newUser);

    return { id: id, message: 'User registered successfully' };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { login, password } = loginDto;

    try {
      const user = await this.userRepository.findOne({ where: { login } });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { userId: user.id, login: user.login };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnauthorizedException('Invalid credentials or internal error');
    }
  }

  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken);

      const newAccessToken = this.jwtService.sign(
        { userId: payload.userId, login: payload.login },
        { expiresIn: '15m' },
      );
      const newRefreshToken = this.jwtService.sign(
        { userId: payload.userId, login: payload.login },
        { expiresIn: '7d' },
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
