// src/public/public.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePessoaDto } from '../pessoas/dto/create-pessoa.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async listarComunidades() {
    return this.prisma.organization.findMany({
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    });
  }

  async cadastrarDizimista(dto: CreatePessoaDto) {
    let organizationId = dto.organizationId || null;

    if (organizationId) {
      const org = await this.prisma.organization.findUnique({
        where: { id: organizationId },
        select: { id: true, nome: true },
      });

      if (!org) {
        throw new BadRequestException('Comunidade selecionada não existe.');
      }

      dto.comunidadeContribui = org.nome;
    }

    const situacaoDizimista = dto.situacaoDizimista || 'DesejaSerDizimista';
    const ehDizimista = situacaoDizimista !== 'NaoDizimista';

    const dataNascimento = new Date(`${dto.dataNascimento}T00:00:00`);

    const data: any = {
      nomeCompleto: dto.nomeCompleto,
      dataNascimento,
      status: 'pendente',
      organizationId: organizationId,
      ehDizimista,
      situacaoDizimista,
    };

    if (dto.comunidadeContribui) {
      data.comunidadeContribui = dto.comunidadeContribui;
    }

    if (dto.telefone) data.telefone = dto.telefone;
    if (dto.endereco) data.endereco = dto.endereco;
    if (dto.bairro) data.bairro = dto.bairro;
    if (dto.cep) data.cep = dto.cep;
    if (dto.estadoCivil) data.estadoCivil = dto.estadoCivil;

    if (dto.batizado !== undefined) data.batizado = dto.batizado;
    if (dto.desejaBatismo !== undefined) data.desejaBatismo = dto.desejaBatismo;
    if (dto.catequista !== undefined) data.catequista = dto.catequista;
    if (dto.desejaCatequese !== undefined)
      data.desejaCatequese = dto.desejaCatequese;
    if (dto.confessaRegularmente !== undefined)
      data.confessaRegularmente = dto.confessaRegularmente;
    if (dto.frequenciaMissa) data.frequenciaMissa = dto.frequenciaMissa;
    if (dto.temEucaristia !== undefined) data.temEucaristia = dto.temEucaristia;
    if (dto.temCrisma !== undefined) data.temCrisma = dto.temCrisma;
    if (dto.temMatrimonio !== undefined) data.temMatrimonio = dto.temMatrimonio;

    if (dto.movimentosPastorais)
      data.movimentosPastorais = dto.movimentosPastorais;

    if (dto.conjuge) data.conjuge = dto.conjuge;
    if (dto.filhos && dto.filhos.length > 0) data.filhos = dto.filhos;

    data.observacoes =
      `[PENDENTE - cadastro público] ${dto.observacoes || ''}`.trim();

    console.log('Salvando pessoa:', {
      nome: data.nomeCompleto,
      organizationId: data.organizationId,
      comunidadeContribui: data.comunidadeContribui,
    });

    return this.prisma.pessoa.create({ data });
  }
}
