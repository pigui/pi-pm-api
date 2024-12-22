import { AggregateRoot } from '@nestjs/cqrs';
import { UserRole } from './value-objects/user-role';
import { UserStatus } from './value-objects/user-status';

export class User extends AggregateRoot {
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: UserRole;
  public status!: UserStatus;
  public createdAt!: Date;
  public updatedAt!: Date;
  constructor(public id: string) {
    super();
  }
}
