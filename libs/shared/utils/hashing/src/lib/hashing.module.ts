import { Module } from '@nestjs/common';
import { BcryptModule } from './bcrypt/bcrypt.module';

@Module({
  exports: [BcryptModule],
  imports: [BcryptModule],
})
export class HashingModule {}
