import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { ObjectId } from '@mikro-orm/mongodb';

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
      createdAt,
      updatedAt
    );
  }
}
