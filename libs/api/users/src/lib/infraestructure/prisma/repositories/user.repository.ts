import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../application/ports/user.repository';
import { User } from '../../../domain/user';
import { concatMap, EMPTY, from, iif, map, Observable, of } from 'rxjs';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '@api/shared/util/prisma';
import { HashingService } from '@api/shared/util/hashing';
import type * as Prisma from '@prisma/client';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly hashingService: HashingService
  ) {}
  createWithPassword(user: User, password: string): Observable<User> {
    return this.findByEmail(user.email).pipe(
      concatMap((findUser) => {
        return iif(
          () => !!findUser,
          from(this.hashingService.hash(password)).pipe(
            concatMap((hash: string) => {
              const userInput: Prisma.Prisma.UserCreateInput = {
                ...user,
                password: hash,
              };
              return from(
                this.prismaService.user.create({ data: userInput })
              ).pipe(
                map((newUser: Prisma.User) => this.userMapper.toDomain(newUser))
              );
            })
          ),
          EMPTY
        );
      })
    );
  }
  findById(id: string): Observable<User> {
    return from(this.prismaService.user.findUnique({ where: { id } })).pipe(
      concatMap((user: Prisma.User | null) => {
        if (!user) {
          return EMPTY;
        }
        return of(this.userMapper.toDomain(user));
      })
    );
  }
  findByEmail(email: string): Observable<User> {
    return from(this.prismaService.user.findUnique({ where: { email } })).pipe(
      concatMap((user: Prisma.User | null) => {
        if (!user) {
          return EMPTY;
        }
        return of(this.userMapper.toDomain(user));
      })
    );
  }
}
