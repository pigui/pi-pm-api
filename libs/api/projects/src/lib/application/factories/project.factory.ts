import { Injectable } from '@nestjs/common';
import { ObjectId } from '@mikro-orm/mongodb';
import { Project } from '../../domain/project';
import { User } from '@api/users';
import { ProjectStatus } from '../../domain/value-objects/project-status';
import { ProjectCreatedEvent } from '../events/project-created.event';

@Injectable()
export class ProjectFactory {
  create(
    name: string,
    descripton: string | null,
    owner: { id: string },
    users: Array<{ id: string }>,
    createdAt: Date,
    updatedAt: Date
  ): Project {
    const project = new Project(new ObjectId().toHexString());
    project.name = name;
    project.description = descripton;
    project.status = new ProjectStatus('initial');
    project.owner = new User(owner.id);
    project.users = users.map((user) => new User(user.id)) ?? [];
    project.createdAt = createdAt;
    project.updatedAt = updatedAt;
    project.apply(new ProjectCreatedEvent(project), { skipHandler: true });

    return project;
  }
}
