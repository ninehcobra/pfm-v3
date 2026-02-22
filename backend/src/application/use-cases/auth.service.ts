import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type {
  IAuthService,
  LoginResponse,
  RegisterDto,
  LoginDto,
  JwtPayload,
} from './auth.service.interface';
import type { IUserRepository } from 'src/domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository.interface';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    return new UserDto(user);
  }

  async login(credentials: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (
      !user ||
      !(await bcrypt.compare(credentials.password, user.password!))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    await this.userRepository.update(user.id, { refreshToken });

    return {
      accessToken,
      user: new UserDto(user),
    };
  }

  async refresh(refreshToken: string): Promise<string> {
    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const user = await this.userRepository.findByRefreshToken(refreshToken);

      if (!user || user.id !== payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateAccessToken(user.id);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  private async generateAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId }, { expiresIn: '15m' });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId }, { expiresIn: '7d' });
  }
}
