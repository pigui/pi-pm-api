import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { Auth } from '../../domain/auth';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from '@api/users';
import {
  catchError,
  concatMap,
  from,
  lastValueFrom,
  Observable,
  throwError,
} from 'rxjs';
import { RefreshTokenRepository } from '../ports/refresh-token.repository';
import { LoginRepository } from '../ports/login.repository';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand, Auth>
{
  private readonly logger = new Logger(RefreshTokenCommandHandler.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly loginRepository: LoginRepository
  ) {}
  execute(command: RefreshTokenCommand): Promise<Auth> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(command)}`
    );
    const refreshToken$: Observable<Auth> = from(
      this.refreshTokenRepository.refreshTokens(command.token)
    ).pipe(
      concatMap((userToken: User) => {
        return from(this.usersService.findUserById(userToken.id)).pipe(
          concatMap((user: User) => this.loginRepository.login(user))
        );
      }),
      catchError(() => throwError(() => new UnauthorizedException()))
    );

    return lastValueFrom(refreshToken$);
  }
}
