import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@api/users';
import { concatMap, forkJoin, from, map, Observable, throwError } from 'rxjs';
import { Auth } from '../../../domain/auth';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenIdStorage } from '../refresh-token-id/refresh-token-id.storage';
import { RefreshTokenRepository } from '../../../application/ports/refresh-token.repository';
import { LoginRepository } from '../../../application/ports/login.repository';
import { VerifyTokenRepository } from '../../../application/ports/verify-token.repository';

@Injectable()
export class AuthRepositoryImpl
  implements RefreshTokenRepository, LoginRepository, VerifyTokenRepository
{
  private readonly logger = new Logger(AuthRepositoryImpl.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdStorage: RefreshTokenIdStorage,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}
  login(user: User): Observable<Auth> {
    this.logger.log(this.login.name);
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
          return from(
            this.refreshTokenIdStorage.insert(user.id, refreshTokenId)
          ).pipe(map(() => token));
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
    this.logger.log(this.verifyToken.name);
    return from(
      this.jwtService.verifyAsync<{
        sub: string;
        refreshTokenId: string;
        user: User;
      }>(token, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      })
    ).pipe(
      map((verifyToken) => {
        return Object.assign(User, verifyToken.user);
      })
    );
  }

  refreshTokens(token: string): Observable<User> {
    this.logger.log(this.refreshTokens.name);
    return from(
      this.jwtService.verifyAsync<{ user: User } & { refreshTokenId: string }>(
        token,
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
        }
      )
    ).pipe(
      concatMap(
        (
          payload: { user: User } & {
            refreshTokenId: string;
          }
        ) => {
          return from(
            this.refreshTokenIdStorage.validate(
              payload.user.id,
              payload.refreshTokenId
            )
          ).pipe(
            concatMap((isValid: boolean) => {
              if (isValid) {
                return from(
                  this.refreshTokenIdStorage.invalidate(payload.user.id)
                ).pipe(map(() => Object.assign(User, payload.user)));
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
    this.logger.log(this.signToken.name);
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
