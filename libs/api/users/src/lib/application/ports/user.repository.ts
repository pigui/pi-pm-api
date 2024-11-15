import { Observable } from 'rxjs';
import { User } from '../../domain/user';

export abstract class UserRepository {
  abstract createWithPassword(user: User, password: string): Observable<User>;
  abstract findById(id: string): Observable<User>;
  abstract findByEmail(email: string): Observable<User>;
}
