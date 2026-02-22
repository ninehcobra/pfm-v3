import { UserDto } from '../dto/user.dto';

export interface JwtPayload {
  sub: string;
  email?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  roleId: string;
  avatar?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserDto;
}

export interface IAuthService {
  register(data: RegisterDto): Promise<UserDto>;
  login(credentials: LoginDto): Promise<LoginResponse>;
  refresh(refreshToken: string): Promise<string>;
  logout(userId: string): Promise<void>;
}

export const AUTH_SERVICE = 'IAuthService';
