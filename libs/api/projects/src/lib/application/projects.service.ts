import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Project } from '../domain/project';
import { CreateProjectCommand } from './commands/create-project.command';
import { FindProjectsByOwnerQuery } from './queries/find-projects-by-owner.query';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  create(
    name: string,
    description: string | null,
    owner: string,
    users: Array<string>
  ): Promise<Project> {
    return this.commandBus.execute(
      new CreateProjectCommand(name, description, owner, users)
    );
  }

  findByOwner(id: string): Promise<Array<Project>> {
    return this.queryBus.execute(new FindProjectsByOwnerQuery(id));
  }
}
