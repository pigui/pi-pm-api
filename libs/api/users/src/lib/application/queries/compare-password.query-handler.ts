import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ComparePasswordQuery } from './compare-password.query';
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { ComparePasswordRepository } from '../ports/compare-password.repository';

@QueryHandler(ComparePasswordQuery)
export class ComparePasswordQueryHandler
  implements IQueryHandler<ComparePasswordQuery, boolean>
{
  private readonly logger = new Logger(ComparePasswordQueryHandler.name);
  constructor(
    private readonly comparePasswordRepository: ComparePasswordRepository
  ) {}
  execute(query: ComparePasswordQuery): Promise<boolean> {
    this.logger.log(
      `[${this.execute.name.toUpperCase()}] ${JSON.stringify(query)}`
    );
    const comparePassword$ = this.comparePasswordRepository.comparePassword(
      query.user,
      query.password
    );
    return lastValueFrom(comparePassword$);
  }
}
