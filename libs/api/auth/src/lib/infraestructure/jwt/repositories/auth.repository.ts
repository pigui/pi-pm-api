import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../../application/ports/auth.repository';
import { User } from '@api/users';
import {
  concatMap,
  forkJoin,
  from,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Auth } from '../../../domain/auth';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@api/shared/utils/redis';
import { v4 as uuid } from 'uuid';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenIdStorage } from '../refresh-token-id/refresh-token-id.storage';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdStorage: RefreshTokenIdStorage,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}
  login(user: User): Observable<Auth> {
    const refreshTokenId: string = uuid();
    return forkJoin([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        user,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
        user,
      }).pipe(
        concatMap((token: string) => {
          return from(this.refreshTokenIdStorage.insert(user.id, token)).pipe(
            map(() => token)
          );
        })
      ),
    ]).pipe(
      map(
        ([accessToken, refreshToken]: [string, string]) =>
          new Auth(user, accessToken, refreshToken)
      )
    );
  }

  verifyToken(token: string): Observable<User> {
    return from(
      this.jwtService.verifyAsync<User>(token, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      })
    ).pipe(map((user: User) => Object.assign(User, user)));
  }

  refreshToken(token: string): Observable<User> {
    return from(
      this.jwtService.verifyAsync<User & { refreshTokenId: string }>(token, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      })
    ).pipe(
      concatMap(
        (
          payload: User & {
            refreshTokenId: string;
          }
        ) => {
          return from(
            this.refreshTokenIdStorage.validate(
              payload.id,
              payload.refreshTokenId
            )
          ).pipe(
            concatMap((isValid: boolean) => {
              if (isValid) {
                return from(
                  this.refreshTokenIdStorage.invalidate(payload.id)
                ).pipe(map(() => Object.assign(User, payload)));
              }
              return throwError(() => new UnauthorizedException());
            })
          );
        }
      )
    );
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
