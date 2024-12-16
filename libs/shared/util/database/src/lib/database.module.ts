import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './entities/user';

@Global()
@Module({
  imports: [
    ConfigModule,
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        driver: MongoDriver,
        clientUrl: configService.get<string>('DATABASE_URL'),
        dbName: configService.get<string>('DATABASE_NAME'),
        ensureIndexes: true,
        entities: [UserEntity],
      }),
      imports: [ConfigModule],
    }),
    MikroOrmModule.forFeature([UserEntity]),
  ],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}
