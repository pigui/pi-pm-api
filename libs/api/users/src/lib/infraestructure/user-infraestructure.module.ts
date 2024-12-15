import { Module } from '@nestjs/common';
import { MongoUserPersistenceModule } from './mongo/mongo-persistence.module';

@Module({
  imports: [MongoUserPersistenceModule],
  exports: [MongoUserPersistenceModule],
})
export class UserInfraestructureModule {}
