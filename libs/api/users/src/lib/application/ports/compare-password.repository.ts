import { Observable } from 'rxjs';
import { User } from '../../domain/user';

export abstract class ComparePasswordRepository {
  abstract comparePassword(
    user: User,
    hashPassword: string
  ): Observable<boolean>;
}
