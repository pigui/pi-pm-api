import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterWithPasswordCommand } from './register-with-password.command';
import { Auth } from '../domain/auth';
import { User, UsersService } from '@api/users';
import { concatMap, from, lastValueFrom, Observable } from 'rxjs';
import { AuthRepository } from './ports/auth.repository';

@CommandHandler(RegisterWithPasswordCommand)
export class RegisterWithPasswordCommandHandler
  implements ICommandHandler<RegisterWithPasswordCommand, Auth>
{
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository
  ) {}
  execute(command: RegisterWithPasswordCommand): Promise<Auth> {
    const register$: Observable<Auth> = from(
      this.usersService.createUserWithPassword(
        command.email,
        command.firstName,
        command.lastName,
        command.password
      )
    ).pipe(
      concatMap((userCreated: User) => {
        return this.authRepository.login(userCreated);
      })
    );

    return lastValueFrom(register$);
  }
}
