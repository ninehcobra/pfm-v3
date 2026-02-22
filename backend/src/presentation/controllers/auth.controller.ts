import { Controller, Post, Body, Inject } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/application/use-cases/auth.service.interface';
import type { IAuthService } from 'src/application/use-cases/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private authService: IAuthService) {}

  @Post('register')
  async register(@Body() data: any) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() credentials: any) {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  async logout(@Body('userId') userId: string) {
    return this.authService.logout(userId);
  }
}
