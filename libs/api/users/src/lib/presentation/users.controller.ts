import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserWithPasswordDto } from './dto/create-user-with-password.dto';
import { CreateUserWithPasswordCommand } from '../application/create-user-with-password.command';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiConflictResponse()
  @ApiCreatedResponse({ type: UserDto })
  @Post('with-password')
  createUserWithPassword(
    @Body() createUserWithPasswordDto: CreateUserWithPasswordDto
  ) {
    return this.usersService.createUserWithPassword(
      new CreateUserWithPasswordCommand(
        createUserWithPasswordDto.email,
        createUserWithPasswordDto.firstName,
        createUserWithPasswordDto.lastName,
        createUserWithPasswordDto.password
      )
    );
  }
}
