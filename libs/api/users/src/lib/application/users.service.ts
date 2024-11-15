import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserWithPasswordCommand } from './create-user-with-password.command';
import { User } from '../domain/user';

@Injectable()
export class UsersService {
  constructor(private readonly commandBus: CommandBus) {}

  createUserWithPassword(
    createUserWithPasswordCommand: CreateUserWithPasswordCommand
  ): Promise<User> {
    return this.commandBus.execute(createUserWithPasswordCommand);
  }
}
