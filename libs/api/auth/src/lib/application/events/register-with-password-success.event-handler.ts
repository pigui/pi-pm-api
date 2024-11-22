import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RegisterWithPasswordSuccessEvent } from './register-with-password-success.event';
import { Logger } from '@nestjs/common';

@EventsHandler(RegisterWithPasswordSuccessEvent)
export class RegisterWithPasswordSuccessEventHandler
  implements IEventHandler<RegisterWithPasswordSuccessEvent>
{
  private readonly logger = new Logger(
    RegisterWithPasswordSuccessEventHandler.name
  );
  handle(event: RegisterWithPasswordSuccessEvent) {
    this.logger.log(
      `[${this.handle.name.toUpperCase()}] ${JSON.stringify(event)}`
    );
  }
}
