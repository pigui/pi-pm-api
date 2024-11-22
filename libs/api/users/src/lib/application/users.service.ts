import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserWithPasswordCommand } from './commands/create-user-with-password.command';
import { User } from '../domain/user';
import { FindUserByIdQuery } from './queries/find-user-by-id.query';
import { FindUserByEmailQuery } from './queries/find-user-by-email.query';
import { ComparePasswordQuery } from './queries/compare-password.query';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  createUserWithPassword(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<User> {
    this.logger.log(this.createUserWithPassword.name);
    return this.commandBus.execute(
      new CreateUserWithPasswordCommand(email, firstName, lastName, password)
    );
  }

  findUserById(id: string): Promise<User> {
    this.logger.log(this.findUserById.name);
    return this.queryBus.execute(new FindUserByIdQuery(id));
  }

  findUserByEmail(email: string): Promise<User> {
    this.logger.log(this.findUserByEmail.name);
    return this.queryBus.execute(new FindUserByEmailQuery(email));
  }

  comparePassword(user: User, password: string): Promise<boolean> {
    this.logger.log(this.comparePassword.name);
    return this.queryBus.execute(new ComparePasswordQuery(user, password));
  }
}
