import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

enum ProjectStatus {
  INITIAL = 'INITIAL',
  CANCELED = 'CANCELED',
  BLOCKED = 'BLOCKED',
}

@Entity({ tableName: 'projects' })
export class ProjectEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property()
  ownerId!: ObjectId;

  @Property()
  users!: Array<ObjectId>;

  @Property({ default: ProjectStatus.INITIAL })
  status?: ProjectStatus;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date;

  @Property({ nullable: true })
  description?: string;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt?: Date;
}
