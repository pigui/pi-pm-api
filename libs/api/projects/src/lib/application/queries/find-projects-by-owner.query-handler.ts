import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindProjectsByOwnerQuery } from './find-projects-by-owner.query';
import { Project } from '../../domain/project';
import { Logger } from '@nestjs/common';
import { FindProjectsByOwnerRepository } from '../ports/find-projects-by-owner.repository';
import { lastValueFrom } from 'rxjs';

@QueryHandler(FindProjectsByOwnerQuery)
export class FindProjectsByOwnerQueryHandler
  implements IQueryHandler<FindProjectsByOwnerQuery, Array<Project>>
{
  private readonly logger = new Logger(FindProjectsByOwnerQueryHandler.name);
  constructor(
    private readonly findProjectsByOwnerRepository: FindProjectsByOwnerRepository
  ) {}

  execute(query: FindProjectsByOwnerQuery): Promise<Array<Project>> {
    this.logger.log(this.execute.name);
    const projects$ = this.findProjectsByOwnerRepository.findByOwner(
      query.ownerId
    );
    return lastValueFrom(projects$);
  }
}
