import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFactory } from './factories/user.factory';
import { UserInfraestructureModule } from '../infraestructure/user-infraestructure.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserWithPasswordCommandHandler } from './create-user-with-password.command-handler';
import { UsersController } from '../presentation/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserFactory, CreateUserWithPasswordCommandHandler],
  imports: [UserInfraestructureModule, CqrsModule],
  exports: [UsersService],
})
export class UsersModule {}
