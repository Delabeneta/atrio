// src/organizations/organizations.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  async create(dto: CreateOrganizationDto, user: any) {
    const existing = await this.prisma.organization.findFirst({
      where: { nome: dto.nome },
    });

    if (existing) {
      throw new ConflictException(
        `Já existe uma comunidade com o nome "${dto.nome}"`,
      );
    }

    let paroquia = await this.prisma.paroquia.findFirst();
    if (!paroquia) {
      paroquia = await this.prisma.paroquia.create({
        data: { nome: 'Paróquia Matriz' },
      });
      console.log('Paróquia padrão criada:', paroquia.id);
    }

    if (dto.coordenadorId) {
      const coordenador = await this.prisma.user.findUnique({
        where: { id: dto.coordenadorId },
      });

      if (!coordenador) {
        throw new NotFoundException('Coordenador não encontrado');
      }

      if (coordenador.organizationId) {
        throw new ConflictException(
          'Este usuário já está vinculado a uma comunidade',
        );
      }
    }

    const organization = await this.prisma.organization.create({
      data: {
        nome: dto.nome,
        paroquiaId: paroquia.id,
        proximoCodigoDizimista: dto.ultimoCodigoDizimista || 10000,
        coordenadorId: dto.coordenadorId || null, // Pode ser null
      },
    });

    await this.auditLog.log({
      actorId: user.id,
      action: 'CREATE',
      entity: 'Organization',
      entityId: organization.id,
      details: { nome: organization.nome },
    });

    if (dto.coordenadorId) {
      await this.prisma.user.update({
        where: { id: dto.coordenadorId },
        data: {
          organizationId: organization.id,
          role: 'COORDENADOR', // Força o papel como coordenador
        },
      });
    }

    return this.findOne(organization.id, null);
  }
  async findAll(user: any) {
    // SUPER_ADMIN e ADMIN vêem todas as organizações
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      return this.prisma.organization.findMany({
        include: {
          coordenador: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          _count: {
            select: {
              pessoas: {
                where: { status: 'ativo' },
              },
            },
          },
        },
        orderBy: { nome: 'asc' },
      });
    }

    // COORDENADOR e LIDER vêem apenas sua organização
    if (user?.organizationId) {
      const org = await this.prisma.organization.findUnique({
        where: { id: user.organizationId },
        include: {
          coordenador: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
          _count: {
            select: {
              pessoas: {
                where: { status: 'ativo' },
              },
            },
          },
        },
      });

      return org ? [org] : [];
    }

    return [];
  }

  async findOne(id: string, user: any) {
    if (user) {
      await this.validateAccess(user, id);
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        coordenador: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
          },
        },
        usuarios: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
          },
        },
        pessoas: {
          where: { status: 'ativo' },
          select: {
            id: true,
            nomeCompleto: true,
            codigoDizimista: true,
            status: true,
          },
          take: 10,
          orderBy: { nomeCompleto: 'asc' },
        },
        _count: {
          select: {
            pessoas: {
              where: { status: 'ativo' },
            },
            usuarios: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    return organization;
  }

  async update(id: string, dto: UpdateOrganizationDto, user: any) {
    await this.findOne(id, null);

    const data: any = {};
    if (dto.nome) data.nome = dto.nome;
    if (dto.ultimoCodigoDizimista !== undefined) {
      data.proximoCodigoDizimista = dto.ultimoCodigoDizimista;
    }

    if (dto.coordenadorId) {
      const novoCoordenador = await this.prisma.user.findUnique({
        where: { id: dto.coordenadorId },
      });

      if (!novoCoordenador) {
        throw new NotFoundException('Coordenador não encontrado');
      }

      // Remove o coordenador antigo desta comunidade, se houver.
      await this.prisma.user.updateMany({
        where: { organizationId: id, role: 'COORDENADOR' },
        data: { role: 'LIDER' },
      });

      await this.prisma.user.update({
        where: { id: dto.coordenadorId },
        data: { organizationId: id, role: 'COORDENADOR' },
      });

      data.coordenadorId = dto.coordenadorId;
    }

    const atualizado = await this.prisma.organization.update({
      where: { id },
      data,
    });

    await this.auditLog.log({
      actorId: user.id,
      action: 'UPDATE',
      entity: 'Organization',
      entityId: id,
      details: { camposAlterados: Object.keys(data) },
    });

    return atualizado;
  }

  async remove(id: string, user: any) {
    const org = await this.findOne(id, null);

    // Verifica se tem pessoas vinculadas
    const count = await this.prisma.pessoa.count({
      where: { organizationId: id },
    });

    if (count > 0) {
      throw new BadRequestException(
        `Não é possível excluir a comunidade "${org.nome}" porque existem ${count} pessoas vinculadas.`,
      );
    }

    // Remove os vínculos dos usuários
    await this.prisma.user.updateMany({
      where: { organizationId: id },
      data: {
        organizationId: null,
        role: 'LIDER',
      },
    });

    const removida = await this.prisma.organization.delete({
      where: { id },
    });

    await this.auditLog.log({
      actorId: user.id,
      action: 'DELETE',
      entity: 'Organization',
      entityId: id,
      details: { nome: org.nome },
    });

    return removida;
  }

  private async validateAccess(user: any, organizationId: string) {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      return true;
    }

    if (user.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta comunidade',
      );
    }

    return true;
  }

  async getProximoCodigoDizimista(organizationId: string): Promise<string> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new NotFoundException('Organização não encontrada');
    }

    let ultimoCodigo = org.proximoCodigoDizimista + 1;

    // Busca o maior código usado na organização
    const ultimoUsado = await this.prisma.pessoa.findFirst({
      where: {
        organizationId,
        codigoDizimista: { not: null },
      },
      orderBy: { codigoDizimista: 'desc' },
      select: { codigoDizimista: true },
    });

    if (ultimoUsado?.codigoDizimista) {
      const codigoNum = parseInt(ultimoUsado.codigoDizimista);
      if (!isNaN(codigoNum) && codigoNum > ultimoCodigo) {
        ultimoCodigo = codigoNum;
      }
    }

    const proximo = ultimoCodigo + 1;
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { proximoCodigoDizimista: proximo },
    });

    return proximo.toString();
  }
}
