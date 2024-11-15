import { Module } from '@nestjs/common';
import { PrismaUserPersistenceModule } from './prisma/prisma-persistence.module';

@Module({
  imports: [PrismaUserPersistenceModule],
  exports: [PrismaUserPersistenceModule],
})
export class UserInfraestructureModule {}
