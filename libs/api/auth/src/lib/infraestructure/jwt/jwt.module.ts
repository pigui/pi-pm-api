import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepositoryImpl } from './repositories/auth.repository';
import { RedisModule } from '@api/shared/util/redis';
import { HashingModule } from '@api/shared/util/hashing';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenIdStorage } from './refresh-token-id/refresh-token-id.storage';
import { LoginRepository } from '../../application/ports/login.repository';
import { RefreshTokenRepository } from '../../application/ports/refresh-token.repository';
import { VerifyTokenRepository } from '../../application/ports/verify-token.repository';

@Module({
  imports: [
    HashingModule,
    RedisModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    AuthRepositoryImpl,
    {
      provide: LoginRepository,
      useExisting: AuthRepositoryImpl,
    },
    {
      provide: RefreshTokenRepository,
      useExisting: AuthRepositoryImpl,
    },
    {
      provide: VerifyTokenRepository,
      useExisting: AuthRepositoryImpl,
    },
    RefreshTokenIdStorage,
  ],
  exports: [LoginRepository, RefreshTokenRepository, VerifyTokenRepository],
})
export class JwtAuthModule {}
