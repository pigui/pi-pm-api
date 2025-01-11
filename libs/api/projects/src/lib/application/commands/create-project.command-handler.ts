import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from './create-project.command';
import { Project } from '../../domain/project';
import { CreateProjectRepository } from '../ports/create-project.repository';
import { ProjectFactory } from '../factories/project.factory';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler
  implements ICommandHandler<CreateProjectCommand, Project>
{
  private readonly logger = new Logger(CreateProjectCommandHandler.name);
  constructor(
    private readonly createProjectRepository: CreateProjectRepository,
    private readonly projectFactory: ProjectFactory
  ) {}
  execute(command: CreateProjectCommand): Promise<Project> {
    this.logger.log(this.execute.name);
    const newProject: Project = this.projectFactory.create(
      command.name,
      command.description,
      { id: command.owner },
      command.users.map((user: string) => {
        return { id: user };
      }),
      new Date(),
      new Date()
    );
    const project$: Observable<Project> = this.createProjectRepository
      .create(newProject)
      .pipe(
        tap((projectCreated: Project) => {
          projectCreated.commit();
        })
      );
    return lastValueFrom(project$);
  }
}
