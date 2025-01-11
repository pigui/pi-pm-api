import { User } from '@api/users';
import { Observable } from 'rxjs';

export abstract class RefreshTokenRepository {
  abstract refreshTokens(token: string): Observable<User>;
}
