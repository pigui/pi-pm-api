import { Module } from '@nestjs/common';
import { JwtAuthModule } from './jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  exports: [JwtAuthModule],
})
export class AuthInfraestructureModule {}
