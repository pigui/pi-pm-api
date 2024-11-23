import { IQuery } from '@nestjs/cqrs';

export class VerifyTokenQuery implements IQuery {
  constructor(public readonly token: string) {}
}
