import { UserEntity } from '@api/shared/utils/database';
import { User } from '../../domain/user';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity._id.toHexString(),
      entity.email,
      entity.firstName,
      entity.lastName,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
