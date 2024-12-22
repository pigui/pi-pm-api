import { Injectable } from '@nestjs/common';
import { ObjectId } from '@mikro-orm/mongodb';
import { Project } from '../../domain/project';
import { User } from '@api/users';
import { ProjectStatus } from '../../domain/value-objects/project-status';

@Injectable()
export class ProjectFactory {
  create(
    name: string,
    descripton: string | null,
    owner: User,
    users: Array<User>,
    createdAt: Date,
    updatedAt: Date
  ): Project {
    return new Project(
      new ObjectId().toHexString(),
      name,
      descripton,
      new ProjectStatus('initial'),
      owner,
      users,
      createdAt,
      updatedAt
    );
  }
}
