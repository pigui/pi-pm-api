import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFactory } from './factories/user.factory';
import { UsersInfraestructureModule } from '../infraestructure/user-infraestructure.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserWithPasswordCommandHandler } from './commands/create-user-with-password.command-handler';
import { UsersController } from '../presentation/users.controller';
import { FindUserByIdQueryHandler } from './queries/find-user-by-id.query-handler';
import { FindUserByEmailQueryHandler } from './queries/find-user-by-email.query-handler';
import { ComparePasswordQueryHandler } from './queries/compare-password.query-handler';
import { UserCreatedEventHandler } from './events/user-created.event-handler';
import { UserSaga } from './sagas/user.saga';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UserFactory,
    CreateUserWithPasswordCommandHandler,
    FindUserByIdQueryHandler,
    FindUserByEmailQueryHandler,
    ComparePasswordQueryHandler,
    UserCreatedEventHandler,
    UserSaga,
  ],
  imports: [UsersInfraestructureModule, CqrsModule],
  exports: [UsersService, UserFactory],
})
export class UsersModule {}
