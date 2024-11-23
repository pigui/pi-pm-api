import { Observable } from 'rxjs';
import { Auth } from '../../domain/auth';
import { User } from '@api/users';

export abstract class AuthRepository {
  abstract login(user: User): Observable<Auth>;
  abstract refreshToken(token: string): Observable<Auth>;
  abstract verifyToken(token: string): Observable<User>;
}
