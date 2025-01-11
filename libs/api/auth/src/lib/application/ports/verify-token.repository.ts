import { User } from '@api/users';
import { Observable } from 'rxjs';

export abstract class VerifyTokenRepository {
  abstract verifyToken(token: string): Observable<User>;
}
