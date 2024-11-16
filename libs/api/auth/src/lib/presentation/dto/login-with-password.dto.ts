import { OmitType } from '@nestjs/swagger';
import { RegisterWithPasswordDto } from './register-with-password.dto';

export class LoginWithPasswordDto extends OmitType(RegisterWithPasswordDto, [
  'firstName',
  'lastName',
]) {}
{
}
