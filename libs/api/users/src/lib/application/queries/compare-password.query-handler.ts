import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ComparePasswordQuery } from './compare-password.query';
import { UserRepository } from '../ports/user.repository';
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

@QueryHandler(ComparePasswordQuery)
export class ComparePasswordQueryHandler
  implements IQueryHandler<ComparePasswordQuery, boolean>
{
  private readonly logger = new Logger(ComparePasswordQueryHandler.name);
  constructor(private readonly userRepository: UserRepository) {}
  execute(query: ComparePasswordQuery): Promise<boolean> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(query)}`
    );
    const comparePassword$ = this.userRepository.comparePassword(
      query.user,
      query.password
    );
    return lastValueFrom(comparePassword$);
  }
}
