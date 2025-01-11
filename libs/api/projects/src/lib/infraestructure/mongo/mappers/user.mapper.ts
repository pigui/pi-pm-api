import { UserEntity } from '@api/shared/util/database';
import { User, UserRole, UserStatus } from '@api/users';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const user = new User(entity._id.toHexString());
    user.email = entity.email;
    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.role = new UserRole(
      entity.role?.toString().toLowerCase() as 'user' | 'admin'
    );
    user.status = new UserStatus(entity.isBlocked ? 'blocked' : 'active');
    user.createdAt = entity.createdAt ?? new Date();
    user.updatedAt = entity.updatedAt ?? new Date();

    return user;
  }
}
