import { Module } from '@nestjs/common';
import { MongoUserPersistenceModule } from './mongo/prisma-persistence.module';

@Module({
  imports: [MongoUserPersistenceModule],
  exports: [MongoUserPersistenceModule],
})
export class UserInfraestructureModule {}
