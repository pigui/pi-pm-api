import { User } from '@api/users';
import { ICommand } from '@nestjs/cqrs';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly owner: User,
    public readonly users: Array<User>
  ) {}
}
