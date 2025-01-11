import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../domain/user';
import { FindUserByIdQuery } from './find-user-by-id.query';
import {
  concatMap,
  iif,
  lastValueFrom,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { Logger, NotFoundException } from '@nestjs/common';
import { FindUserByIdRepository } from '../ports/find-user-by-id.repository';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery, User | null>
{
  private readonly logger = new Logger(FindUserByIdQueryHandler.name);
  constructor(
    private readonly findUserByIdRepository: FindUserByIdRepository
  ) {}
  execute(query: FindUserByIdQuery): Promise<User | null> {
    this.logger.log(`[${this.execute.name}] ${JSON.stringify(query)}`);
    const user$: Observable<User | null> = this.findUserByIdRepository
      .findById(query.id)
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
