import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../../../application/ports/user.repository';
import { User } from '../../../domain/user';
import { concatMap, from, map, Observable, of, throwError } from 'rxjs';
import { HashingService } from '@api/shared/util/hashing';
import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { UserMapper } from '../../mappers/user.mapper';
import { Role, UserEntity } from '@api/shared/utils/database';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  private readonly repository = this.em.getRepository(UserEntity);
  constructor(
    private readonly hashingService: HashingService,
    private readonly em: EntityManager
  ) {}

  createWithPassword(user: User, password: string): Observable<User> {
    this.logger.log(this.createWithPassword.name);
    return this.findByEmail(user.email).pipe(
      concatMap((findUser: User | null) => {
        if (findUser) {
          return throwError(() => new ConflictException());
        }
        return from(this.hashingService.hash(password)).pipe(
          concatMap((hashPassword: string) => {
            const newUser = this.repository.create({
              _id: new ObjectId(user.id),
              email: user.email,
              password: hashPassword,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role.isAdmin() ? Role.ADMIN : Role.USER,
              isBlocked: user.status.isBlocked(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            return from(this.repository.insert(newUser)).pipe(
              concatMap((userCreatedId: string | ObjectId) =>
                from(
                  this.repository.findOneOrFail({
                    _id: new ObjectId(userCreatedId.toString()),
                  })
                ).pipe(
                  map((userCreated: UserEntity) =>
                    UserMapper.toDomain(userCreated)
                  )
                )
              )
            );
          })
        );
      })
    );
  }
  findById(id: string): Observable<User | null> {
    this.logger.log(this.findById.name);
    return from(this.repository.findOne({ id })).pipe(
      map((user: UserEntity | null) => {
        if (!user) {
          return null;
        }
        return UserMapper.toDomain(user);
      })
    );
  }
  findByEmail(email: string): Observable<User | null> {
    this.logger.log(this.findByEmail.name);
    console.log({ repo: this.repository, em: this.em });
    return from(this.repository.findOne({ email })).pipe(
      map((user: UserEntity | null) => {
        if (!user) {
          return null;
        }
        return UserMapper.toDomain(user);
      })
    );
  }
  comparePassword(user: User, password: string): Observable<boolean> {
    this.logger.log(this.comparePassword.name);
    return from(
      this.repository.findOne({
        id: user.id,
      })
    ).pipe(
      concatMap((findUser: UserEntity | null) => {
        if (!findUser?.password) {
          return of(false);
        }
        return of(findUser.password).pipe(
          concatMap((hashPassword: string) =>
            from(this.hashingService.compare(password, hashPassword))
          )
        );
      })
    );
  }
}
