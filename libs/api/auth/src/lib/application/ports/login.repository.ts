import { User } from '@api/users';
import { Observable } from 'rxjs';
import { Auth } from '../../domain/auth';

export abstract class LoginRepository {
  abstract login(user: User): Observable<Auth>;
}
