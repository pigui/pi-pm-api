import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from './user-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private readonly logger = new Logger(UserCreatedEventHandler.name);
  handle(event: UserCreatedEvent): void {
    this.logger.log(
      `[${this.handle.name.toUpperCase()}] ${JSON.stringify(event)}`
    );
  }
}
