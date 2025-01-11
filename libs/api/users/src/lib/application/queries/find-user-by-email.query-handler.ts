import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../domain/user';
import {
  concatMap,
  iif,
  lastValueFrom,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { FindUserByEmailQuery } from './find-user-by-email.query';
import { Logger, NotFoundException } from '@nestjs/common';
import { FindUserByEmailRepository } from '../ports/find-user-by-email.repository';

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailQueryHandler
  implements IQueryHandler<FindUserByEmailQuery, User | null>
{
  private readonly logger = new Logger(FindUserByEmailQueryHandler.name);
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}
  execute(query: FindUserByEmailQuery): Promise<User | null> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(query)}`
    );
    const user$: Observable<User | null> = this.findUserByEmailRepository
      .findByEmail(query.email)
      .pipe(
        concatMap((user) =>
          iif(
            () => !!user,
            of(user),
            throwError(() => new NotFoundException())
          )
        )
      );
    return lastValueFrom(user$);
  }
}
