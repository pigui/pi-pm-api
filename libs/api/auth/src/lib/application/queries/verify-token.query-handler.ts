import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VerifyTokenQuery } from './verify-token.query';
import { User } from '@api/users';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { VerifyTokenRepository } from '../ports/verify-token.repository';

@QueryHandler(VerifyTokenQuery)
export class VerifyTokenQueryHandler
  implements IQueryHandler<VerifyTokenQuery, User>
{
  private readonly logger = new Logger(VerifyTokenQueryHandler.name);
  constructor(private readonly veriyTokenRepository: VerifyTokenRepository) {}
  execute(query: VerifyTokenQuery): Promise<User> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(query)}`
    );
    const payload$ = this.veriyTokenRepository
      .verifyToken(query.token)
      .pipe(catchError(() => throwError(() => new UnauthorizedException())));

    return lastValueFrom(payload$);
  }
}
