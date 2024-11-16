import { UserDto } from '@api/users';
import { Auth } from '../../domain/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class AuthDto extends Auth {
  @ApiProperty()
  @ValidateNested()
  override user!: UserDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  override accessToken!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  override refreshToken!: string;
}
