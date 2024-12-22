import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserWithPasswordDto } from './dto/create-user-with-password.dto';
import { CreateUserWithPasswordCommand } from '../application/commands/create-user-with-password.command';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @ApiConflictResponse()
  @ApiUnauthorizedResponse()
  @ApiCreatedResponse({ type: UserDto })
  @Post('with-password')
  createUserWithPassword(
    @Body() createUserWithPasswordDto: CreateUserWithPasswordDto
  ) {
    this.logger.log(this.createUserWithPassword.name);
    return this.usersService.createUserWithPassword(
      createUserWithPasswordDto.email.toLowerCase(),
      createUserWithPasswordDto.firstName.toLowerCase(),
      createUserWithPasswordDto.lastName.toLowerCase(),
      createUserWithPasswordDto.password
    );
  }
}
