import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterWithPasswordDto } from './dto/register-with-password.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginWithPasswordDto } from './dto/login-with-password.dto';
import { AuthDto } from './dto/auth.dto';
import { Auth } from '../application/decorators/auth.decorator';
import { AuthType } from '../application/enums/auth-types.enum';

@Auth(AuthType.None)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: AuthDto })
  @Post('register-with-password')
  registerWithPassword(
    @Body() registerWithPasswordDto: RegisterWithPasswordDto
  ) {
    return this.authService.registerWithPassword(
      registerWithPasswordDto.email,
      registerWithPasswordDto.firstName,
      registerWithPasswordDto.lastName,
      registerWithPasswordDto.password
    );
  }

  @ApiOkResponse({ type: AuthDto })
  @Post('login-with-password')
  loginWithPassword(@Body() loginWithPasswordDto: LoginWithPasswordDto) {
    return this.authService.loginWithPassword(
      loginWithPasswordDto.email,
      loginWithPasswordDto.password
    );
  }
}
