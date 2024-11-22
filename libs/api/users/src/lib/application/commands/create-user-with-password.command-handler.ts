import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/user';
import { UserFactory } from '../factories/user.factory';
import { UserRepository } from '../ports/user.repository';
import { lastValueFrom, Observable, tap } from 'rxjs';
import { Logger } from '@nestjs/common';
import { CreateUserWithPasswordCommand } from './create-user-with-password.command';
import { UserCreatedEvent } from '../events/user-created.event';

@CommandHandler(CreateUserWithPasswordCommand)
export class CreateUserWithPasswordCommandHandler
  implements ICommandHandler<CreateUserWithPasswordCommand, User>
{
  private readonly logger = new Logger(
    CreateUserWithPasswordCommandHandler.name
  );
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus
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
    const user$: Observable<User> = this.userRepository
      .createWithPassword(newUser, command.password)
      .pipe(
        tap((user: User) => this.eventBus.publish(new UserCreatedEvent(user)))
      );
    return lastValueFrom(user$);
  }
}
