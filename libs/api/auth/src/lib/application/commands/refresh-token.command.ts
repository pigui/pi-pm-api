import { ICommand } from '@nestjs/cqrs';

export class RefreshTokenCommand implements ICommand {
  constructor(public token: string) {}
}
