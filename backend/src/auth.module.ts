import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/use-cases/auth.service';
import { AUTH_SERVICE } from './application/use-cases/auth.service.interface';
import { UserPersistenceModule } from './infrastructure/prisma/user-persistence.module';

import { JwtStrategy } from './infrastructure/security/jwt.strategy';

@Module({
  imports: [
    UserPersistenceModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    JwtStrategy,
  ],
  exports: [AUTH_SERVICE],
})
export class AuthModule {}
