import { IQuery } from '@nestjs/cqrs';

export class FindProjectsByOwnerQuery implements IQuery {
  constructor(public readonly ownerId: string) {}
}
