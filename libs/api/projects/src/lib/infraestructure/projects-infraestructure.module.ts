import { Module } from '@nestjs/common';
import { MongoProjectsPersistenceModule } from './mongo/mongo-persistence.module';

@Module({
  imports: [MongoProjectsPersistenceModule],
  exports: [MongoProjectsPersistenceModule],
})
export class ProjectsInfraestructureModule {}
