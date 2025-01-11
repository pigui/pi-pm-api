import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { User } from '../../domain/user';
import { UserFactory } from '../factories/user.factory';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { Logger } from '@nestjs/common';
import { CreateUserWithPasswordCommand } from './create-user-with-password.command';
import { CreateUserWithPasswordRepository } from '../ports/create-user-with-password.repository';

@CommandHandler(CreateUserWithPasswordCommand)
export class CreateUserWithPasswordCommandHandler
  implements ICommandHandler<CreateUserWithPasswordCommand, User>
{
  private readonly logger = new Logger(
    CreateUserWithPasswordCommandHandler.name
  );
  constructor(
    private readonly userFactory: UserFactory,
    private readonly createUserWithPasswordRepository: CreateUserWithPasswordRepository,
    private readonly eventPublisher: EventPublisher
  ) {}
  execute(command: CreateUserWithPasswordCommand): Promise<User> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(command)}`
    );
    const newUser: User = this.userFactory.create(
      command.email,
      command.firstName,
      command.lastName,
      new Date(),
      new Date()
    );

    const user$: Observable<User> = this.createUserWithPasswordRepository
      .createWithPassword(newUser, command.password)
      .pipe(
        tap((user: User) => {
          this.eventPublisher.mergeObjectContext(user);
          user.commit();
        })
      );

    return lastValueFrom(user$);
  }
}
