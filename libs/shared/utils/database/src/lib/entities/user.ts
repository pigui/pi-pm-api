import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Index,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
@Index({ properties: ['email'], name: 'email_unique' })
export class UserEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ nullable: true })
  password!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
