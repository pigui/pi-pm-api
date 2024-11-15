import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserWithPasswordCommand } from './create-user-with-password.command';
import { User } from '../domain/user';
import { UserFactory } from './factories/user.factory';
import { UserRepository } from './ports/user.repository';
import {
  concatMap,
  iif,
  lastValueFrom,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { ConflictException } from '@nestjs/common';

@CommandHandler(CreateUserWithPasswordCommand)
export class CreateUserWithPasswordCommandHandler
  implements ICommandHandler<CreateUserWithPasswordCommand, User>
{
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository
  ) {}
  execute(command: CreateUserWithPasswordCommand): Promise<User> {
    const newUser: User = this.userFactory.create(
      command.email,
      command.firstName,
      command.lastName,
      new Date(),
      new Date()
    );
    const user$: Observable<User> = this.userRepository
      .createWithPassword(newUser, command.password)
      .pipe(
        concatMap((user: User) =>
          iif(
            () => !user,
            of(user),
            throwError(() => new ConflictException())
          )
        )
      );
    return lastValueFrom(user$);
  }
}
