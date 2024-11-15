import { Injectable } from '@nestjs/common';
import * as Prisma from '@prisma/client';
import { User } from '../../../domain/user';

@Injectable()
export class UserMapper {
  toDomain(entity: Prisma.User): User {
    return new User(
      entity.id,
      entity.email,
      entity.firstName,
      entity.lastName,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
