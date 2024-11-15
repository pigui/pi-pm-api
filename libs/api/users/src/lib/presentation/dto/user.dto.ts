import { IsDate, IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { User } from '../../domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends User {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  override id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  override email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  override firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  override lastName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  override createdAt!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  override updatedAt!: Date;
}
