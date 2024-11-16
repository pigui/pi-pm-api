import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepository } from '../../application/ports/auth.repository';
import { AuthRepositoryImpl } from './repositories/auth.repository';
import { RedisModule } from '@api/shared/utils/redis';
import { HashingModule } from '@api/shared/util/hashing';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HashingModule,
    RedisModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: AuthRepository,
      useClass: AuthRepositoryImpl,
    },
  ],
  exports: [AuthRepository],
})
export class JwtAuthModule {}
