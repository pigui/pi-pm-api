import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserFactory {
  create(
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(uuid(), email, firstName, lastName, createdAt, updatedAt);
  }
}
