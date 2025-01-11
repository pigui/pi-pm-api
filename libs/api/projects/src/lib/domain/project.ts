import { User } from '@api/users';
import { ProjectStatus } from './value-objects/project-status';
import { AggregateRoot } from '@nestjs/cqrs';

export class Project extends AggregateRoot {
  public name!: string;
  public description!: string | null;
  public status!: ProjectStatus;
  public owner!: User;
  public users!: Array<User>;
  public createdAt!: Date;
  public updatedAt!: Date;
  constructor(public id: string) {
    super();
  }
}
