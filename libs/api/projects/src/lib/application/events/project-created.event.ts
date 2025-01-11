import { IEvent } from '@nestjs/cqrs';
import { Project } from '../../domain/project';

export class ProjectCreatedEvent implements IEvent {
  constructor(public readonly project: Project) {}
}
