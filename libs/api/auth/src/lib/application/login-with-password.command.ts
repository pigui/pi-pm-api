import { ICommand } from '@nestjs/cqrs';

export class LoginWithPasswordCommand implements ICommand {
  constructor(public email: string, public password: string) {}
}
