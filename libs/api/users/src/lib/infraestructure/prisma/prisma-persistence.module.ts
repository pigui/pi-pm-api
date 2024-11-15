import { Module } from '@nestjs/common';
import { UserRepository } from '../../application/ports/user.repository';
import { UserRepositoryImpl } from './repositories/user.repository';
import { PrismaModule } from '@api/shared/util/prisma';
import { UserMapper } from './mappers/user.mapper';
import { HashingModule } from '@api/shared/util/hashing';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    UserMapper,
  ],
  imports: [PrismaModule, HashingModule],
  exports: [UserRepository],
})
export class PrismaUserPersistenceModule {}
