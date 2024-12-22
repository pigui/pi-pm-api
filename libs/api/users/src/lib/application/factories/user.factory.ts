import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { ObjectId } from '@mikro-orm/mongodb';
import { UserRole } from '../../domain/value-objects/user-role';
import { UserStatus } from '../../domain/value-objects/user-status';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class UserFactory {
  create(
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date
  ): User {
    const user = new User(new ObjectId().toHexString());
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = new UserRole('user');
    user.status = new UserStatus('active');
    user.createdAt = createdAt;
    user.updatedAt = updatedAt;
    user.apply(new UserCreatedEvent(user), { skipHandler: true });
    return user;
  }
}
