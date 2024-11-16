import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '../../../application/ports/auth.repository';
import { User } from '@api/users';
import { forkJoin, from, map, Observable, tap } from 'rxjs';
import { Auth } from '../../../domain/auth';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@api/shared/utils/redis';
import { v4 as uuid } from 'uuid';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}
  login(user: User): Observable<Auth> {
    const refreshTokenId: string = uuid();
    return forkJoin([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }).pipe(tap((token) => this.redisService.set(user.id, token))),
    ]).pipe(
      map(
        ([accessToken, refreshToken]: [string, string]) =>
          new Auth(user, accessToken, refreshToken)
      )
    );
  }

  refreshToken(token: string): Observable<Auth> {
    throw new Error('Method not implemented.');
  }

  private signToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T
  ): Observable<string> {
    return from(
      this.jwtService.signAsync(
        {
          sub: userId,
          ...payload,
        },
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn,
        }
      )
    );
  }
}
