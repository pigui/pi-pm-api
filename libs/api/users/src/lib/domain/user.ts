import { UserRole } from './value-objects/user-role';
import { UserStatus } from './value-objects/user-status';

export class User {
  constructor(
    public id: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public role: UserRole,
    public status: UserStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
