import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectsService } from './projects.service';
import { ProjectsInfraestructureModule } from '../infraestructure/projects-infraestructure.module';
import { ProjectFactory } from './factories/project.factory';
import { CreateProjectCommandHandler } from './commands/create-project.command-handler';
import { ProjectsController } from '../presentations/projects.controller';
import { FindProjectsByOwnerQueryHandler } from './queries/find-projects-by-owner.query-handler';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectFactory,
    CreateProjectCommandHandler,
    FindProjectsByOwnerQueryHandler,
  ],
  imports: [ProjectsInfraestructureModule, CqrsModule],
  exports: [],
})
export class ProjectsModule {}
