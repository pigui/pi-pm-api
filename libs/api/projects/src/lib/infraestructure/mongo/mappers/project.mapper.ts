import {
  ProjectEntity,
  UserEntity,
  ProjectStatus as ProjectEntityStatus,
} from '@api/shared/util/database';
import { Project } from '../../../domain/project';
import { ProjectStatus } from '../../../domain/value-objects/project-status';
import { UserMapper } from './user.mapper';

export class ProjectMapper {
  static toDomain(
    entity: ProjectEntity,
    owner: UserEntity,
    users: Array<UserEntity> = []
  ): Project {
    const project = new Project(entity.id);
    project.name = entity.name;
    project.description = entity.description ?? null;
    project.status = new ProjectStatus(
      entity.status === ProjectEntityStatus.INITIAL
        ? 'initial'
        : ProjectEntityStatus.CANCELED
        ? 'canceled'
        : 'blocked'
    );
    project.createdAt = entity.createdAt ?? new Date();
    project.owner = UserMapper.toDomain(owner);
    project.users = users.map((user) => UserMapper.toDomain(user));
    project.updatedAt = entity.updatedAt ?? new Date();
    return project;
  }
}
