import { ICommand } from '@nestjs/cqrs';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly owner: string,
    public readonly users: Array<string>
  ) {}
}
