import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from './create-project.command';
import { Project } from '../../domain/project';

@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler
  implements ICommandHandler<CreateProjectCommand, Project>
{
  execute(command: CreateProjectCommand): Promise<Project> {
    throw new Error('Method not implemented.');
  }
}
