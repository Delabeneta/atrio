// src/pessoas/pessoas.module.ts
import { Module } from '@nestjs/common';
import { PessoasController } from './pessoas.controller';
import { PessoasService } from './pessoas.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { AuditLogModule } from 'src/audit-log/audit-log.module';

@Module({
  imports: [PrismaModule, AuthModule, OrganizationsModule, AuditLogModule],
  controllers: [PessoasController],
  providers: [PessoasService],
  exports: [PessoasService],
})
export class PessoasModule {}
