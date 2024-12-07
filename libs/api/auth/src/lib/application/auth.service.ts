import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Auth } from '../domain/auth';
import { LoginWithPasswordCommand } from './commands/login-with-password.command';
import { RegisterWithPasswordCommand } from './commands/register-with-password.command';
import { VerifyTokenQuery } from './queries/verify-token.query';
import { User } from '@api/users';
import { RefreshTokenCommand } from './commands/refresh-token.command';

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

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

  refreshToken(token: string): Promise<Auth> {
    return this.commandBus.execute(new RefreshTokenCommand(token));
  }

  verifyToken(token: string): Promise<User> {
    return this.queryBus.execute(new VerifyTokenQuery(token));
  }
}
