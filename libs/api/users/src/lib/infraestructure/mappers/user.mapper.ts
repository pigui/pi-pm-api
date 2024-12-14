import { UserEntity } from '@api/shared/utils/database';
import { User } from '../../domain/user';
import { UserRole } from '../../domain/value-objects/user-role';
import { UserStatus } from '../../domain/value-objects/user-status';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity._id.toHexString(),
      entity.email,
      entity.firstName,
      entity.lastName,
      new UserRole(entity.role?.toString().toLowerCase() as 'user' | 'admin'),
      new UserStatus(entity.isBlocked ? 'blocked' : 'active'),
      entity.createdAt ?? new Date(),
      entity.updatedAt ?? new Date()
    );
  }
}
