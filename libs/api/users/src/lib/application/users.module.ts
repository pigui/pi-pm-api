import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFactory } from './factories/user.factory';
import { UserInfraestructureModule } from '../infraestructure/user-infraestructure.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserWithPasswordCommandHandler } from './create-user-with-password.command-handler';
import { UsersController } from '../presentation/users.controller';
import { FindUserByIdQueryHandler } from './find-user-by-id.query-handler';
import { FindUserByEmailQueryHandler } from './find-user-by-email.query-handler';
import { ComparePasswordQueryHandler } from './compare-password.query-handler';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UserFactory,
    CreateUserWithPasswordCommandHandler,
    FindUserByIdQueryHandler,
    FindUserByEmailQueryHandler,
    ComparePasswordQueryHandler,
  ],
  imports: [UserInfraestructureModule, CqrsModule],
  exports: [UsersService, UserFactory],
})
export class UsersModule {}
