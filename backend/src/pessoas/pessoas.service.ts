// src/pessoas/pessoas.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AprovarPendenteDto } from './dto/aprovar-pendente.dto';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class PessoasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

  private getOrganizationFilter(user: any) {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      return {};
    }

    if (user.organizationId) {
      return { organizationId: user.organizationId };
    }

    return { id: 'none' };
  }

  private async canAccess(user: any, pessoaId: string): Promise<boolean> {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      return true;
    }

    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id: pessoaId },
      select: { organizationId: true },
    });

    if (!pessoa) return false;

    return pessoa.organizationId === user.organizationId;
  }

  async findAll(user: any) {
    const where = this.getOrganizationFilter(user);
    return this.prisma.pessoa.findMany({
      where,
      orderBy: { nomeCompleto: 'asc' },
    });
  }

  async findOne(id: string, user: any) {
    if (!(await this.canAccess(user, id))) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta pessoa',
      );
    }

    return this.prisma.pessoa.findUnique({ where: { id } });
  }

  async create(createPessoaDto: CreatePessoaDto, user: any) {
    let organizationId = createPessoaDto.organizationId;

    if (user.role === 'COORDENADOR' || user.role === 'LIDER') {
      organizationId = user.organizationId;

      if (!organizationId) {
        throw new ForbiddenException(
          'Você não está vinculado a uma comunidade',
        );
      }
    }

    let codigoDizimista = createPessoaDto.codigoDizimista;
    if (createPessoaDto.ehDizimista && !codigoDizimista && organizationId) {
      codigoDizimista = await this.gerarCodigoDizimista(organizationId);
    }

    const dataNascimento = new Date(createPessoaDto.dataNascimento);

    const data: any = {
      nomeCompleto: createPessoaDto.nomeCompleto,
      dataNascimento,
      status: createPessoaDto.status || 'ativo',
      organizationId: organizationId || null,
      ehDizimista: createPessoaDto.ehDizimista || false,
      codigoDizimista: codigoDizimista || null,
    };

    if (createPessoaDto.telefone) data.telefone = createPessoaDto.telefone;
    if (createPessoaDto.endereco) data.endereco = createPessoaDto.endereco;
    if (createPessoaDto.bairro) data.bairro = createPessoaDto.bairro;
    if (createPessoaDto.cep) data.cep = createPessoaDto.cep;
    if (createPessoaDto.comunidadeContribui)
      data.comunidadeContribui = createPessoaDto.comunidadeContribui;
    if (createPessoaDto.estadoCivil)
      data.estadoCivil = createPessoaDto.estadoCivil;
    if (createPessoaDto.batizado !== undefined)
      data.batizado = createPessoaDto.batizado;
    if (createPessoaDto.desejaBatismo !== undefined)
      data.desejaBatismo = createPessoaDto.desejaBatismo;
    if (createPessoaDto.catequista !== undefined)
      data.catequista = createPessoaDto.catequista;
    if (createPessoaDto.desejaCatequese !== undefined)
      data.desejaCatequese = createPessoaDto.desejaCatequese;
    if (createPessoaDto.confessaRegularmente !== undefined)
      data.confessaRegularmente = createPessoaDto.confessaRegularmente;
    if (createPessoaDto.frequenciaMissa)
      data.frequenciaMissa = createPessoaDto.frequenciaMissa;
    if (createPessoaDto.temEucaristia !== undefined)
      data.temEucaristia = createPessoaDto.temEucaristia;
    if (createPessoaDto.temCrisma !== undefined)
      data.temCrisma = createPessoaDto.temCrisma;
    if (createPessoaDto.temMatrimonio !== undefined)
      data.temMatrimonio = createPessoaDto.temMatrimonio;
    if (createPessoaDto.movimentosPastorais)
      data.movimentosPastorais = createPessoaDto.movimentosPastorais;
    if (createPessoaDto.observacoes)
      data.observacoes = createPessoaDto.observacoes;
    if (createPessoaDto.situacaoDizimista)
      data.situacaoDizimista = createPessoaDto.situacaoDizimista;

    if (createPessoaDto.conjuge) data.conjuge = createPessoaDto.conjuge;
    if (createPessoaDto.filhos && createPessoaDto.filhos.length > 0)
      data.filhos = createPessoaDto.filhos;

    const pessoa = await this.prisma.pessoa.create({ data });
    await this.auditLog.log({
      actorId: user.id,
      action: 'CREATE',
      entity: 'Pessoa',
      entityId: pessoa.id,
      details: { nomeCompleto: pessoa.nomeCompleto },
    });
    return pessoa;
  }

  async update(id: string, updatePessoaDto: UpdatePessoaDto, user: any) {
    if (!(await this.canAccess(user, id))) {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta pessoa',
      );
    }

    const data: any = {};
    Object.keys(updatePessoaDto).forEach((key) => {
      const value = (updatePessoaDto as any)[key];
      if (value !== undefined && value !== null) {
        if (key === 'dataNascimento' && value) {
          data[key] = new Date(value);
        } else {
          data[key] = value;
        }
      }
    });

    const pessoa = await this.prisma.pessoa.update({ where: { id }, data });
    await this.auditLog.log({
      actorId: user.id,
      action: 'UPDATE',
      entity: 'Pessoa',
      entityId: id,
      details: { camposAlterados: Object.keys(data) },
    });
    return pessoa;
  }

  async updateStatus(id: string, status: string, user: any) {
    if (!(await this.canAccess(user, id))) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar esta pessoa',
      );
    }

    const validStatus = ['ativo', 'inativo', 'pendente', 'rejeitado'];
    if (!validStatus.includes(status)) {
      throw new BadRequestException(
        `Status inválido. Use: ${validStatus.join(', ')}`,
      );
    }

    return this.prisma.pessoa.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string, user: any) {
    if (!(await this.canAccess(user, id))) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir esta pessoa',
      );
    }

    if (user.role === 'LIDER') {
      throw new ForbiddenException('Líder não pode excluir pessoas');
    }

    const pessoa = await this.prisma.pessoa.delete({ where: { id } });
    await this.auditLog.log({
      actorId: user.id,
      action: 'DELETE',
      entity: 'Pessoa',
      entityId: id,
      details: { nomeCompleto: pessoa.nomeCompleto },
    });
    return pessoa;
  }

  // COORDENADOR agora pode aprovar/rejeitar fiéis da própria comunidade.
  // LIDER continua sem essa permissão.
  async aprovarPendente(id: string, dto: AprovarPendenteDto, user: any) {
    if (user.role === 'LIDER') {
      throw new ForbiddenException(
        'Líder não pode aprovar ou rejeitar cadastros',
      );
    }

    const pessoa = await this.prisma.pessoa.findUnique({ where: { id } });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    // COORDENADOR só pode decidir sobre fiéis da própria comunidade.
    if (
      user.role === 'COORDENADOR' &&
      pessoa.organizationId !== user.organizationId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para aprovar fiéis de outra comunidade',
      );
    }

    if (dto.aprovado) {
      let codigoDizimista = pessoa.codigoDizimista;
      if (pessoa.ehDizimista && !codigoDizimista && pessoa.organizationId) {
        codigoDizimista = await this.gerarCodigoDizimista(
          pessoa.organizationId,
        );
      }

      const atualizado = await this.prisma.pessoa.update({
        where: { id },
        data: {
          status: 'ativo',
          codigoDizimista,
          observacoes: dto.observacao
            ? `Aprovado: ${dto.observacao}`
            : 'Aprovado',
        },
      });
      await this.auditLog.log({
        actorId: user.id,
        action: 'APPROVE',
        entity: 'Pessoa',
        entityId: id,
        details: { codigoDizimista, observacao: dto.observacao },
      });
      return atualizado;
    }
    const atualizado = await this.prisma.pessoa.update({
      where: { id },
      data: {
        status: 'rejeitado',
        observacoes: dto.observacao
          ? `Rejeitado: ${dto.observacao}`
          : 'Rejeitado',
      },
    });
    await this.auditLog.log({
      actorId: user.id,
      action: 'REJECT',
      entity: 'Pessoa',
      entityId: id,
      details: { observacao: dto.observacao },
    });
    return atualizado;
  }

  async getPendentes(user: any) {
    const where = this.getOrganizationFilter(user);
    return this.prisma.pessoa.findMany({
      where: { ...where, status: 'pendente' },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async gerarCodigoDizimista(organizationId: string): Promise<string> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org) {
      throw new NotFoundException('Organização não encontrada');
    }

    let proximo = org.proximoCodigoDizimista || 10000;

    const ultimoUsado = await this.prisma.pessoa.findFirst({
      where: {
        organizationId,
        codigoDizimista: { not: null },
      },
      orderBy: { codigoDizimista: 'desc' },
      select: { codigoDizimista: true },
    });

    if (ultimoUsado?.codigoDizimista) {
      const num = parseInt(ultimoUsado.codigoDizimista);
      if (!isNaN(num) && num >= proximo) {
        proximo = num + 1;
      }
    }

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { proximoCodigoDizimista: proximo },
    });

    return proximo.toString();
  }
}
