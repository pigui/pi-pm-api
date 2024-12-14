import { UserDto } from '@api/users';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @ValidateNested()
  user!: UserDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
