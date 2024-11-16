import { User } from '@api/users';

export class Auth {
  constructor(
    public user: User,
    public accessToken: string,
    public refreshToken: string
  ) {}
}
