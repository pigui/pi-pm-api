import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectCreatedEvent } from './project-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ProjectCreatedEvent)
export class ProjectCreatedEventHandler
  implements IEventHandler<ProjectCreatedEvent>
{
  private readonly logger = new Logger(ProjectCreatedEventHandler.name);
  handle(event: ProjectCreatedEvent) {
    this.logger.log(
      `[${this.handle.name.toUpperCase()}] ${JSON.stringify(event)}`
    );
  }
}
