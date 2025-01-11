import { UserDto } from '@api/users';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProjectStatusDto {
  @ApiProperty({ enum: ['initial', 'blocked', 'canceled'] })
  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class ProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ nullable: true })
  @IsString()
  description!: string | null;

  @ApiProperty({ type: ProjectStatusDto })
  @ValidateNested()
  status!: ProjectStatusDto;

  @ApiProperty({ type: UserDto })
  @ValidateNested()
  owner!: UserDto;

  @ApiProperty({ type: UserDto, isArray: true })
  @ValidateNested({ each: true })
  users!: Array<UserDto>;

  @ApiProperty()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  updatedAt!: Date;
}
