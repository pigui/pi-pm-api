import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterWithPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;
}
