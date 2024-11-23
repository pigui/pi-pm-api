import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthInfraestructureModule } from '../infraestructure/auth-infraestructure.module';
import { RegisterWithPasswordCommandHandler } from './commands/register-with-password.command-handler';
import { UsersModule } from '@api/users';
import { LoginWithPasswordCommandHandler } from './commands/login-with-password.command-handler';
import { AuthController } from '../presentation/auth.controller';
import { AuthSaga } from './sagas/auth.saga';
import { LoginWithPasswordSuccessEventHandler } from './events/login-with-password-success.event-handler';
import { RegisterWithPasswordSuccessEventHandler } from './events/register-with-password-success.event-handler';
import { VerifyTokenQueryHandler } from './queries/verify-token.query-handler';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';
import { AccessTokenGuard } from '../guards/access-token.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterWithPasswordCommandHandler,
    LoginWithPasswordCommandHandler,
    LoginWithPasswordSuccessEventHandler,
    RegisterWithPasswordSuccessEventHandler,
    VerifyTokenQueryHandler,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AccessTokenGuard,
    AuthSaga,
  ],
  imports: [AuthInfraestructureModule, CqrsModule, UsersModule],
  exports: [AuthService],
})
export class AuthModule {}
