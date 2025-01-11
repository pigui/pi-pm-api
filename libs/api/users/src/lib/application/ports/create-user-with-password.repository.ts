import { Observable } from 'rxjs';
import { User } from '../../domain/user';

export abstract class CreateUserWithPasswordRepository {
  abstract createWithPassword(user: User, password: string): Observable<User>;
}
