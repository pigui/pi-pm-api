import { User } from '@api/users';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../application/constants/auth.constant';

export const CurrentUser = createParamDecorator(
  (field: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  }
);
