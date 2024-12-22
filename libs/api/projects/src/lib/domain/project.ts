import { User } from '@api/users';
import { ProjectStatus } from './value-objects/project-status';

export class Project {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public status: ProjectStatus,
    public owner: User,
    public users: Array<User>,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
