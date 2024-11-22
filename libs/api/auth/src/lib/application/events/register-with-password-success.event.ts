import { User } from '@api/users';
import { IEvent } from '@nestjs/cqrs';

export class RegisterWithPasswordSuccessEvent implements IEvent {
  constructor(public readonly user: User) {}
}
