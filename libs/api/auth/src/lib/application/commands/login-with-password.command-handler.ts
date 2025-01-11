import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LoginWithPasswordCommand } from './login-with-password.command';
import { Auth } from '../../domain/auth';
import { User, UsersService } from '@api/users';
import {
  concatMap,
  from,
  iif,
  lastValueFrom,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { LoginRepository } from '../ports/login.repository';

@CommandHandler(LoginWithPasswordCommand)
export class LoginWithPasswordCommandHandler
  implements ICommandHandler<LoginWithPasswordCommand, Auth>
{
  private readonly logger = new Logger(LoginWithPasswordCommandHandler.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly loginRepository: LoginRepository,
    private readonly eventPublisher: EventPublisher
  ) {}
  execute(command: LoginWithPasswordCommand): Promise<Auth> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(command)}`
    );
    const login$: Observable<Auth> = from(
      this.usersService.findUserByEmail(command.email)
    ).pipe(
      concatMap((findUser: User) => {
        if (!findUser) {
          return throwError(() => new UnauthorizedException());
        }
        return from(
          this.usersService.comparePassword(findUser, command.password)
        ).pipe(
          concatMap((comparePassword: boolean) =>
            iif(
              () => comparePassword,
              this.loginRepository.login(findUser).pipe(
                tap((logged: Auth) => {
                  const { user } = logged;
                  this.eventPublisher.mergeObjectContext(user);
                  user.commit();
                })
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
