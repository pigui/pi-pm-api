import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginWithPasswordCommand } from './login-with-password.command';
import { Auth } from '../domain/auth';
import { UsersService } from '@api/users';
import { AuthRepository } from './ports/auth.repository';
import { concatMap, from, iif, lastValueFrom, throwError } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

@CommandHandler(LoginWithPasswordCommand)
export class LoginWithPasswordCommandHandler
  implements ICommandHandler<LoginWithPasswordCommand, Auth>
{
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository
  ) {}
  execute(command: LoginWithPasswordCommand): Promise<Auth> {
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
              this.authRepository.login(findUser),
              throwError(() => new UnauthorizedException())
            )
          )
        );
      })
    );

    return lastValueFrom(login$);
  }
}
