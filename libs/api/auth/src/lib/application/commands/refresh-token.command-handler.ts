import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './refresh-token.command';
import { Auth } from '../../domain/auth';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@api/users';
import { AuthRepository } from '../ports/auth.repository';
import {
  catchError,
  concatMap,
  from,
  lastValueFrom,
  Observable,
  throwError,
} from 'rxjs';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand, Auth>
{
  private readonly logger = new Logger(RefreshTokenCommandHandler.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository
  ) {}
  execute(command: RefreshTokenCommand): Promise<Auth> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(command)}`
    );
    const refreshUser$: Observable<Auth> = from(
      this.authRepository.refreshToken(command.token)
    ).pipe(
      concatMap((userToken) => {
        return from(this.usersService.findUserById(userToken.id)).pipe(
          concatMap((user) => from(this.authRepository.login(user)))
        );
      }),
      catchError(() => throwError(() => new UnauthorizedException()))
    );

    return lastValueFrom(refreshUser$);
  }
}
