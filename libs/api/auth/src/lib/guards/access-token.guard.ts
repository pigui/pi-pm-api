import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { from, lastValueFrom, map, Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AuthService } from '../application/auth.service';
import { REQUEST_USER_KEY } from '../application/constants/auth.constant';
import { User } from '@api/users';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const accestToken$ = from(this.authService.verifyToken(token)).pipe(
      tap((payload: User) => {
        request[REQUEST_USER_KEY] = payload;
      }),
      map(() => true)
    );
    return lastValueFrom(accestToken$);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
