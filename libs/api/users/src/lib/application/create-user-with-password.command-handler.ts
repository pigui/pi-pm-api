import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserWithPasswordCommand } from './create-user-with-password.command';
import { User } from '../domain/user';
import { UserFactory } from './factories/user.factory';
import { UserRepository } from './ports/user.repository';
import {
  concatMap,
  firstValueFrom,
  iif,
  lastValueFrom,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { ConflictException, Logger } from '@nestjs/common';

@CommandHandler(CreateUserWithPasswordCommand)
export class CreateUserWithPasswordCommandHandler
  implements ICommandHandler<CreateUserWithPasswordCommand, User>
{
  private readonly logger = new Logger(
    CreateUserWithPasswordCommandHandler.name
  );
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository
  ) {}
  execute(command: CreateUserWithPasswordCommand): Promise<User> {
    this.logger.log(this.execute.name);
    const newUser: User = this.userFactory.create(
      command.email,
      command.firstName,
      command.lastName,
      new Date(),
      new Date()
    );
    const user$: Observable<User> = this.userRepository.createWithPassword(
      newUser,
      command.password
    );
    return lastValueFrom(user$);
  }
}
