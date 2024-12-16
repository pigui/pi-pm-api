import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@api/users';
import { AuthModule } from '@api/auth';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@api/shared/util/database';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
