import { Module } from '@nestjs/common';
import { ProjectRepositoryImpl } from './repositories/project.repository';
import { CreateProjectRepository } from '../../application/ports/create-project.repository';
import { FindProjectsByOwnerRepository } from '../../application/ports/find-projects-by-owner.repository';
import { FindProjectByIdRepository } from '../../application/ports/find-project-by-id.repository';

@Module({
  providers: [
    ProjectRepositoryImpl,
    {
      provide: CreateProjectRepository,
      useExisting: ProjectRepositoryImpl,
    },
    {
      provide: FindProjectByIdRepository,
      useExisting: ProjectRepositoryImpl,
    },
    {
      provide: FindProjectsByOwnerRepository,
      useExisting: ProjectRepositoryImpl,
    },
  ],
  exports: [
    CreateProjectRepository,
    FindProjectByIdRepository,
    FindProjectsByOwnerRepository,
  ],
})
export class MongoProjectsPersistenceModule {}
