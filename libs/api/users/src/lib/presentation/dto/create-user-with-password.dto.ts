import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsAlpha } from 'class-validator';
export class CreateUserWithPasswordDto {
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
  @IsAlpha()
  @IsNotEmpty()
  @IsString()
  password!: string;
}
