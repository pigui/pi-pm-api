import { Module } from '@nestjs/common';
import { MongoUsersPersistenceModule } from './mongo/mongo-persistence.module';

@Module({
  imports: [MongoUsersPersistenceModule],
  exports: [MongoUsersPersistenceModule],
})
export class UsersInfraestructureModule {}
