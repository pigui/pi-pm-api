import { Module } from '@nestjs/common';
import { UserRepository } from '../../application/ports/user.repository';
import { UserRepositoryImpl } from './repositories/user.repository';
import { HashingModule } from '@api/shared/util/hashing';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  imports: [HashingModule],
  exports: [UserRepository],
})
export class MongoUserPersistenceModule {}
