import { Observable } from 'rxjs';
import { User } from '../../domain/user';

export abstract class FindUserByEmailRepository {
  abstract findByEmail(email: string): Observable<User | null>;
}
