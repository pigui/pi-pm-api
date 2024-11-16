import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../application/ports/user.repository';
import { User } from '../../../domain/user';
import {
  concatMap,
  EMPTY,
  from,
  iif,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '@api/shared/util/prisma';
import { HashingService } from '@api/shared/util/hashing';
import type * as Prisma from '@prisma/client';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly hashingService: HashingService
  ) {}

  createWithPassword(user: User, password: string): Observable<User> {
    this.logger.log(this.createWithPassword.name);
    return this.findByEmail(user.email).pipe(
      concatMap((findUser: User | null) => {
        if (findUser) {
          return throwError(() => new UnauthorizedException());
        }
        return from(this.hashingService.hash(password)).pipe(
          concatMap((hashPassword: string) =>
            from(
              this.prismaService.user.create({
                data: { ...user, password: hashPassword },
              })
            ).pipe(
              map((newUser: Prisma.User) => this.userMapper.toDomain(newUser))
            )
          )
        );
      })
    );
  }
  findById(id: string): Observable<User | null> {
    this.logger.log(this.findById.name);
    return from(this.prismaService.user.findUnique({ where: { id } })).pipe(
      map((user: Prisma.User | null) => {
        if (!user) {
          return null;
        }
        return this.userMapper.toDomain(user);
      })
    );
  }
  findByEmail(email: string): Observable<User | null> {
    this.logger.log(this.findByEmail.name);
    return from(this.prismaService.user.findUnique({ where: { email } })).pipe(
      map((user: Prisma.User | null) => {
        if (!user) {
          return null;
        }
        return this.userMapper.toDomain(user);
      })
    );
  }
  comparePassword(user: User, password: string): Observable<boolean> {
    this.logger.log(this.comparePassword.name);
    return from(
      this.prismaService.user.findFirst({
        where: { id: user.id },
        select: { password: true },
      })
    ).pipe(
      concatMap((findUser) => {
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
