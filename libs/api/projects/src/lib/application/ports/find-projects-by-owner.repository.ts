import { Observable } from 'rxjs';
import { Project } from '../../domain/project';

export abstract class FindProjectsByOwnerRepository {
  abstract findByOwner(ownerId: string): Observable<Array<Project>>;
}
