import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from './repositories/user.repository';
import { HashingModule } from '@api/shared/util/hashing';
import { CreateUserWithPasswordRepository } from '../../application/ports/create-user-with-password.repository';
import { ComparePasswordRepository } from '../../application/ports/compare-password.repository';
import { FindUserByEmailRepository } from '../../application/ports/find-user-by-email.repository';
import { FindUserByIdRepository } from '../../application/ports/find-user-by-id.repository';

@Module({
  providers: [
    UserRepositoryImpl,
    {
      provide: CreateUserWithPasswordRepository,
      useExisting: UserRepositoryImpl,
    },
    {
      provide: ComparePasswordRepository,
      useExisting: UserRepositoryImpl,
    },
    {
      provide: FindUserByEmailRepository,
      useExisting: UserRepositoryImpl,
    },
    {
      provide: FindUserByIdRepository,
      useExisting: UserRepositoryImpl,
    },
  ],
  imports: [HashingModule],
  exports: [
    CreateUserWithPasswordRepository,
    ComparePasswordRepository,
    FindUserByEmailRepository,
    FindUserByIdRepository,
  ],
})
export class MongoUsersPersistenceModule {}
