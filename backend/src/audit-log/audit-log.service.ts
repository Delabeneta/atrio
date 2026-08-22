// src/audit-log/audit-log.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT';
export type AuditEntity = 'Pessoa' | 'Organization' | 'User' | 'Paroquia';

interface LogParams {
  actorId: string | null; // null = ação pública/sistema (ex: cadastro público)
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  details?: Record<string, any>;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Nunca deixa uma falha de log quebrar a operação principal —
  // só registra o erro no console do servidor.
  async log(params: LogParams) {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: params.actorId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          details: params.details ?? undefined,
        },
      });
    } catch (err) {
      this.logger.error(
        `Falha ao gravar audit log (${params.entity}/${params.action}): ${err}`,
      );
    }
  }

  async findAll(filtros?: { entity?: string; entityId?: string }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(filtros?.entity ? { entity: filtros.entity } : {}),
        ...(filtros?.entityId ? { entityId: filtros.entityId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}
