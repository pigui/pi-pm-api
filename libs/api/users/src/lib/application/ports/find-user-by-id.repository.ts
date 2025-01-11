import { Observable } from 'rxjs';
import { User } from '../../domain/user';

export abstract class FindUserByIdRepository {
  abstract findById(id: string): Observable<User | null>;
}
