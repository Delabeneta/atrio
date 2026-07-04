// src/pessoas/pessoas.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Prisma } from '@prisma/client';
import { AprovarPendenteDto } from './dto/aprovar-pendente.dto';

@Injectable()
export class PessoasService {
  constructor(private readonly prisma: PrismaService) {}

  private async gerarProximoCodigoDizimista(): Promise<string> {
    const ultimaPessoa = await this.prisma.pessoa.findFirst({
      where: {
        codigoDizimista: {
          not: null,
        },
      },
      orderBy: {
        codigoDizimista: 'desc',
      },
    });

    let proximoNumero = 10142;

    if (ultimaPessoa && ultimaPessoa.codigoDizimista) {
      const ultimoCodigo = parseInt(ultimaPessoa.codigoDizimista);
      if (!isNaN(ultimoCodigo)) {
        proximoNumero = ultimoCodigo + 1;
      }
    }

    return proximoNumero.toString();
  }

  async create(createPessoaDto: CreatePessoaDto) {
    if (createPessoaDto.ehDizimista && !createPessoaDto.codigoDizimista) {
      createPessoaDto.codigoDizimista =
        await this.gerarProximoCodigoDizimista();
    }

    if (createPessoaDto.codigoDizimista) {
      const existe = await this.prisma.pessoa.findUnique({
        where: {
          codigoDizimista: createPessoaDto.codigoDizimista,
        },
      });

      if (existe) {
        throw new ConflictException('Código de dizimista já cadastrado');
      }
    }

    const conjugeJson = createPessoaDto.conjuge
      ? Prisma.JsonNull
      : Prisma.JsonNull;

    const filhosJson =
      createPessoaDto.filhos && createPessoaDto.filhos.length > 0
        ? (createPessoaDto.filhos as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull;

    return this.prisma.pessoa.create({
      data: {
        nomeCompleto: createPessoaDto.nomeCompleto,
        dataNascimento: new Date(`${createPessoaDto.dataNascimento}T00:00:00`),
        telefone: createPessoaDto.telefone,
        endereco: createPessoaDto.endereco,
        bairro: createPessoaDto.bairro,
        cep: createPessoaDto.cep,
        comunidadeParticipa: createPessoaDto.comunidadeParticipa,
        comunidadeContribui: createPessoaDto.comunidadeContribui,
        ehDizimista: createPessoaDto.ehDizimista ?? true,
        estadoCivil: createPessoaDto.estadoCivil,
        batizado: createPessoaDto.batizado ?? false,
        desejaBatismo: createPessoaDto.desejaBatismo ?? false,
        catequista: createPessoaDto.catequista ?? false,
        desejaCatequese: createPessoaDto.desejaCatequese ?? false,
        confessaRegularmente: createPessoaDto.confessaRegularmente ?? false,
        frequenciaMissa: createPessoaDto.frequenciaMissa ?? 'Eventual',
        temEucaristia: createPessoaDto.temEucaristia ?? false,
        temCrisma: createPessoaDto.temCrisma ?? false,
        temMatrimonio: createPessoaDto.temMatrimonio ?? false,
        codigoDizimista: createPessoaDto.codigoDizimista,
        conjuge: createPessoaDto.conjuge as unknown as Prisma.InputJsonValue,
        filhos: createPessoaDto.filhos as unknown as Prisma.InputJsonValue,
        movimentosPastorais: createPessoaDto.movimentosPastorais ?? [],
        observacoes: createPessoaDto.observacoes,
        status: createPessoaDto.status,
      },
    });
  }

  async findAll(incluirInativos: boolean = false) {
    const pessoas = await this.prisma.pessoa.findMany({
      where: incluirInativos
        ? { status: { not: 'pendente' } } // Admin vê todos menos pendentes
        : { status: 'ativo' }, // Padrão: só ativos
      orderBy: { createdAt: 'desc' },
    });

    return pessoas.map((pessoa) => ({
      id: pessoa.id,
      nomeCompleto: pessoa.nomeCompleto,
      dataNascimento: pessoa.dataNascimento.toISOString().split('T')[0],
      codigoDizimista: pessoa.codigoDizimista,
      telefone: pessoa.telefone,
      endereco: pessoa.endereco,
      bairro: pessoa.bairro,
      comunidadeParticipa: pessoa.comunidadeParticipa,
      estadoCivil: pessoa.estadoCivil,
      status: pessoa.status,
      conjuge: pessoa.conjuge,
      filhos: pessoa.filhos,
      movimentosPastorais: pessoa.movimentosPastorais ?? [],
    }));
  }

  async findOne(id: string) {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: { id },
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return pessoa;
  }

  async update(id: string, updatePessoaDto: UpdatePessoaDto) {
    console.log('🔄 Atualizando pessoa:', id);
    console.log('📦 Dados:', JSON.stringify(updatePessoaDto, null, 2));
    await this.findOne(id);

    if (updatePessoaDto.codigoDizimista) {
      const existe = await this.prisma.pessoa.findFirst({
        where: {
          codigoDizimista: updatePessoaDto.codigoDizimista,
          NOT: { id },
        },
      });
      if (existe) {
        throw new ConflictException(
          'Código de dizimista já cadastrado para outra pessoa',
        );
      }
    }

    const updateData: any = { ...updatePessoaDto };

    if (updatePessoaDto.dataNascimento) {
      updateData.dataNascimento = new Date(
        `${updatePessoaDto.dataNascimento}T00:00:00`,
      );
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    return this.prisma.pessoa.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pessoa.delete({
      where: { id },
    });
  }

  async listarPendentes() {
    const pendentes = await this.prisma.pessoa.findMany({
      where: {
        status: 'pendente',
      },
      orderBy: { createdAt: 'desc' },
    });

    return pendentes.map((p) => ({
      id: p.id,
      nomeCompleto: p.nomeCompleto,
      dataNascimento: p.dataNascimento.toISOString().split('T')[0],
      telefone: p.telefone,
      endereco: p.endereco,
      bairro: p.bairro,
      situacaoDizimista: p.situacaoDizimista || 'DesejaSerDizimista',
      createdAt: p.createdAt,
    }));
  }
  async aprovarPendente(id: string, aprovarDto: AprovarPendenteDto) {
    const pessoa = await this.findOne(id);

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    if (aprovarDto.aprovado) {
      let codigoDizimista;
      const situacao = pessoa.situacaoDizimista || 'DesejaSerDizimista';

      if (situacao === 'JaDizimista' || situacao === 'DesejaSerDizimista') {
        codigoDizimista = await this.gerarProximoCodigoDizimista();
      }

      return this.prisma.pessoa.update({
        where: { id },
        data: {
          status: 'ativo',
          ehDizimista: codigoDizimista ? true : false,
          codigoDizimista: codigoDizimista,
          observacoes: `[APROVADO] ${pessoa.observacoes || ''}${aprovarDto.observacao ? ` - ${aprovarDto.observacao}` : ''}`,
        },
      });
    } else {
      return this.prisma.pessoa.update({
        where: { id },
        data: {
          observacoes: `[REJEITADO] ${pessoa.observacoes || ''}${aprovarDto.observacao ? ` - ${aprovarDto.observacao}` : ''}`,
        },
      });
    }
  }

  async inativarPessoa(id: string, motivo?: string) {
    await this.findOne(id);

    return this.prisma.pessoa.update({
      where: { id },
      data: {
        status: 'inativo',
        observacoes: motivo ? `[INATIVO] ${motivo}` : '[INATIVO]',
      },
    });
  }

  async reativarPessoa(id: string) {
    await this.findOne(id);

    return this.prisma.pessoa.update({
      where: { id },
      data: {
        status: 'ativo',
        observacoes: `[REATIVADO] ${new Date().toISOString().split('T')[0]}`,
      },
    });
  }
}
