import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Auth } from '../domain/auth';
import { LoginWithPasswordCommand } from './commands/login-with-password.command';
import { RegisterWithPasswordCommand } from './commands/register-with-password.command';

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  loginWithPassword(email: string, password: string): Promise<Auth> {
    return this.commandBus.execute(
      new LoginWithPasswordCommand(email, password)
    );
  }

  registerWithPassword(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<Auth> {
    return this.commandBus.execute(
      new RegisterWithPasswordCommand(email, firstName, lastName, password)
    );
  }
}
