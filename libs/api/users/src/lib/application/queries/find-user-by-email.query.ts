import { IQuery } from '@nestjs/cqrs';

export class FindUserByEmailQuery implements IQuery {
  constructor(public email: string) {}
}
