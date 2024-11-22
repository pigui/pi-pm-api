import { IQuery } from '@nestjs/cqrs';
import { User } from '../../domain/user';

export class ComparePasswordQuery implements IQuery {
  constructor(public user: User, public password: string) {}
}
