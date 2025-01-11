import { Observable } from 'rxjs';
import { Project } from '../../domain/project';

export abstract class FindProjectByIdRepository {
  abstract findById(id: string): Observable<Project | null>;
}
