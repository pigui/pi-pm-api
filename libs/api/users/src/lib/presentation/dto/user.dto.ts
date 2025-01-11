import {
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
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
  @IsMongoId()
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
  @ValidateNested()
  role!: UserRoleDto;

  @ApiProperty({ type: UserStatusDto })
  @ValidateNested()
  status!: UserStatusDto;
}
