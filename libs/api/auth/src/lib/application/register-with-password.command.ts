import { ICommand } from '@nestjs/cqrs';

export class RegisterWithPasswordCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly password: string
  ) {}
}
