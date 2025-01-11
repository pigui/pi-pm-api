import { Injectable, Logger } from '@nestjs/common';
import { CreateProjectRepository } from '../../../application/ports/create-project.repository';
import { FindProjectByIdRepository } from '../../../application/ports/find-project-by-id.repository';
import { FindProjectsByOwnerRepository } from '../../../application/ports/find-projects-by-owner.repository';
import { Project } from '../../../domain/project';
import { concatMap, forkJoin, from, map, Observable, of, toArray } from 'rxjs';
import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import {
  ProjectEntity,
  ProjectStatus,
  UserEntity,
} from '@api/shared/util/database';
import { ProjectMapper } from '../mappers/project.mapper';

@Injectable()
export class ProjectRepositoryImpl
  implements
    CreateProjectRepository,
    FindProjectByIdRepository,
    FindProjectsByOwnerRepository
{
  private readonly logger = new Logger(ProjectRepositoryImpl.name);
  private readonly projectRepository = this.em.getRepository(ProjectEntity);
  private readonly userRepository = this.em.getRepository(UserEntity);
  constructor(private readonly em: EntityManager) {}
  create(project: Project): Observable<Project> {
    this.logger.log(this.create.name);
    const newProject = this.projectRepository.create({
      _id: new ObjectId(project.id),
      name: project.name,
      description: project.description,
      owner: new ObjectId(project.owner.id),
      users: project.users.map((user) => new ObjectId(user.id)),
      status:
        project.status.value === 'initial'
          ? ProjectStatus.INITIAL
          : project.status.value === 'blocked'
          ? ProjectStatus.BLOCKED
          : ProjectStatus.CANCELED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return forkJoin([
      from(this.userRepository.findOneOrFail({ _id: newProject.owner })),
      from(this.userRepository.find({ _id: newProject.users })),
    ]).pipe(
      concatMap(([owner, users]: [UserEntity, Array<UserEntity>]) => {
        return from(this.projectRepository.insert(newProject)).pipe(
          concatMap((projectCreatedId) =>
            from(
              this.projectRepository.findOneOrFail({
                _id: new ObjectId(projectCreatedId.toString()),
              })
            ).pipe(
              map((projectCreated: ProjectEntity) =>
                ProjectMapper.toDomain(projectCreated, owner, users)
              )
            )
          )
        );
      })
    );
  }
  findById(id: string): Observable<Project | null> {
    this.logger.log(`${this.findById.name} ${JSON.stringify(id)}`);
    return from(this.projectRepository.findOne({ _id: new ObjectId(id) })).pipe(
      concatMap((findProject) => {
        if (!findProject) {
          return of(null);
        }
        return forkJoin([
          from(this.userRepository.findOneOrFail({ _id: findProject.owner })),
          from(
            this.userRepository.find({ _id: { $in: findProject.users ?? [] } })
          ),
        ]).pipe(
          map(([owner, users]: [UserEntity, Array<UserEntity>]) =>
            ProjectMapper.toDomain(findProject, owner, users)
          )
        );
      })
    );
  }
  findByOwner(ownerId: string): Observable<Array<Project>> {
    this.logger.log(`${this.findByOwner.name} ${JSON.stringify(ownerId)}`);
    return from(
      this.userRepository.findOneOrFail({ _id: new ObjectId(ownerId) })
    ).pipe(
      concatMap((owner: UserEntity) => {
        return from(
          this.projectRepository.find({ owner: new ObjectId(ownerId) })
        ).pipe(
          concatMap((projects: Array<ProjectEntity>) =>
            from(projects).pipe(
              concatMap((project: ProjectEntity) =>
                from(
                  this.userRepository.find({
                    _id: {
                      $in: project.users.map((user) => user.id),
                    },
                  })
                ).pipe(
                  map((users: Array<UserEntity>) =>
                    ProjectMapper.toDomain(project, owner, users)
                  )
                )
              ),
              toArray()
            )
          )
        );
      })
    );
  }
}
