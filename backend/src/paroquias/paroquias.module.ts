// src/paroquias/paroquias.module.ts
import { Module } from '@nestjs/common';
import { ParoquiasController } from './paroquias.controller';
import { ParoquiasService } from './paroquias.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ParoquiasController],
  providers: [ParoquiasService],
})
export class ParoquiasModule {}
