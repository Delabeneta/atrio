// src/paroquias/paroquias.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParoquiasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.paroquia.findMany({
      include: {
        admin: { select: { id: true, nome: true, email: true } },
        _count: { select: { organizations: true } },
      },
      orderBy: { nome: 'asc' },
    });
  }
}
