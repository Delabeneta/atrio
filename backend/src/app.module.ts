import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PublicModule } from './public/public.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ParoquiasModule } from './paroquias/paroquias.module';
import { AuditLogController } from './audit-log/audit-log.controller';
import { AuditLogService } from './audit-log/audit-log.service';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PessoasModule,
    AuthModule,
    PublicModule,
    UsersModule,
    OrganizationsModule,
    ParoquiasModule,
    AuditLogModule,
  ],
  controllers: [AppController, AuditLogController],
  providers: [AppService, AuditLogService],
})
export class AppModule {}
