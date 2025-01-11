import { Observable } from 'rxjs';
import { Project } from '../../domain/project';

export abstract class CreateProjectRepository {
  abstract create(project: Project): Observable<Project>;
}
