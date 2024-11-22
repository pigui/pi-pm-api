import { IEvent } from '@nestjs/cqrs';
import { User } from '../../domain/user';

export class UserCreatedEvent implements IEvent {
  constructor(public readonly user: User) {}
}
