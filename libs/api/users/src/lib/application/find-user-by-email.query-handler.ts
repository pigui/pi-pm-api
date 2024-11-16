import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../domain/user';
import { UserRepository } from './ports/user.repository';
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

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailQueryHandler
  implements IQueryHandler<FindUserByEmailQuery, User>
{
  private readonly logger = new Logger(FindUserByEmailQueryHandler.name);
  constructor(private readonly userRepository: UserRepository) {}
  execute(query: FindUserByEmailQuery): Promise<User> {
    this.logger.log(this.execute.name);
    const user$: Observable<User> = this.userRepository
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