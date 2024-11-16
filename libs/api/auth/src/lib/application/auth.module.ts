import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthInfraestructureModule } from '../infraestructure/auth-infraestructure.module';
import { RegisterWithPasswordCommandHandler } from './register-with-password.command-handler';
import { UsersModule } from '@api/users';
import { LoginWithPasswordCommandHandler } from './login-with-password.command-handler';
import { AuthController } from '../presentation/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterWithPasswordCommandHandler,
    LoginWithPasswordCommandHandler,
  ],
  imports: [AuthInfraestructureModule, CqrsModule, UsersModule],
  exports: [AuthService],
})
export class AuthModule {}
