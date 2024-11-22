import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { LoginWithPasswordCommand } from './login-with-password.command';
import { Auth } from '../../domain/auth';
import { UsersService } from '@api/users';
import { AuthRepository } from '../ports/auth.repository';
import { concatMap, from, iif, lastValueFrom, tap, throwError } from 'rxjs';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { LoginWithPasswordSuccessEvent } from '../events/login-with-password-success.event';

@CommandHandler(LoginWithPasswordCommand)
export class LoginWithPasswordCommandHandler
  implements ICommandHandler<LoginWithPasswordCommand, Auth>
{
  private readonly logger = new Logger(LoginWithPasswordCommandHandler.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly eventBus: EventBus
  ) {}
  execute(command: LoginWithPasswordCommand): Promise<Auth> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(command)}`
    );
    const login$ = from(this.usersService.findUserByEmail(command.email)).pipe(
      concatMap((findUser) => {
        if (!findUser) {
          return throwError(() => new UnauthorizedException());
        }
        return from(
          this.usersService.comparePassword(findUser, command.password)
        ).pipe(
          concatMap((comparePassword: boolean) =>
            iif(
              () => comparePassword,
              this.authRepository
                .login(findUser)
                .pipe(
                  tap((logged: Auth) =>
                    this.eventBus.publish(
                      new LoginWithPasswordSuccessEvent(logged?.user)
                    )
                  )
                ),
              throwError(() => new UnauthorizedException())
            )
          )
        );
      })
    );

    return lastValueFrom(login$);
  }
}
