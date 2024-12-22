import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProjectsService } from './projects.service';
import { ProjectsInfraestructureModule } from '../infraestructure/projects-infraestructure.module';
import { ProjectFactory } from './factories/project.factory';
import { CreateProjectCommandHandler } from './commands/create-project.command-handler';

@Module({
  controllers: [],
  providers: [ProjectsService, ProjectFactory, CreateProjectCommandHandler],
  imports: [ProjectsInfraestructureModule, CqrsModule],
  exports: [],
})
export class ProjectsModule {}
