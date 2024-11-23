import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RegisterWithPasswordCommand } from './register-with-password.command';
import { Auth } from '../../domain/auth';
import { User, UsersService } from '@api/users';
import { concatMap, from, lastValueFrom, Observable, tap } from 'rxjs';
import { AuthRepository } from '../ports/auth.repository';
import { Logger } from '@nestjs/common';
import { LoginWithPasswordSuccessEvent } from '../events/login-with-password-success.event';

@CommandHandler(RegisterWithPasswordCommand)
export class RegisterWithPasswordCommandHandler
  implements ICommandHandler<RegisterWithPasswordCommand, Auth>
{
  private readonly logger = new Logger(RegisterWithPasswordCommandHandler.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly eventBus: EventBus
  ) {}
  execute(command: RegisterWithPasswordCommand): Promise<Auth> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(command)}`
    );
    const register$: Observable<Auth> = from(
      this.usersService.createUserWithPassword(
        command.email,
        command.firstName,
        command.lastName,
        command.password
      )
    ).pipe(
      concatMap((userCreated: User) => {
        return this.authRepository
          .login(userCreated)
          .pipe(
            tap((logged: Auth) =>
              this.eventBus.publish(
                new LoginWithPasswordSuccessEvent(logged?.user)
              )
            )
          );
      })
    );

    return lastValueFrom(register$);
  }
}
