import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterWithPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;
}
