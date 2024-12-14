import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { ObjectId } from '@mikro-orm/mongodb';
import { UserRole } from '../../domain/value-objects/user-role';
import { UserStatus } from '../../domain/value-objects/user-status';

@Injectable()
export class UserFactory {
  create(
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(
      new ObjectId().toHexString(),
      email,
      firstName,
      lastName,
      new UserRole('user'),
      new UserStatus('active'),
      createdAt,
      updatedAt
    );
  }
}
