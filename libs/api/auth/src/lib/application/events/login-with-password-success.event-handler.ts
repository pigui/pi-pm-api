import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LoginWithPasswordSuccessEvent } from './login-with-password-success.event';
import { Logger } from '@nestjs/common';

@EventsHandler(LoginWithPasswordSuccessEvent)
export class LoginWithPasswordSuccessEventHandler
  implements IEventHandler<LoginWithPasswordSuccessEvent>
{
  private readonly logger = new Logger(
    LoginWithPasswordSuccessEventHandler.name
  );
  handle(event: LoginWithPasswordSuccessEvent) {
    this.logger.log(
      `[${this.handle.name.toUpperCase()}] ${JSON.stringify(event)}`
    );
  }
}
