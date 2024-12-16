import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Index,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity({ tableName: 'users' })
@Index({ properties: ['email'], name: 'email_unique' })
export class UserEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ nullable: true })
  password?: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({ default: false })
  isBlocked?: boolean;

  @Property({ default: Role.USER })
  role?: Role;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt?: Date;
}
