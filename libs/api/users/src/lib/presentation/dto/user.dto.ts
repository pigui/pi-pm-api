import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UserRoleDto {
  @ApiProperty({ enum: ['user', 'admin'] })
  @IsString()
  @IsNotEmpty()
  value!: string;
}

class UserStatusDto {
  @ApiProperty({ enum: ['active', 'blocked'] })
  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class UserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  updatedAt!: Date;

  @ApiProperty({ type: UserRoleDto })
  role!: UserRoleDto;

  @ApiProperty({ type: UserStatusDto })
  status!: UserStatusDto;
}
