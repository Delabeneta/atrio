/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Pessoa, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';

@Injectable()
export class PessoasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
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

    if (createPessoaDto.email) {
      const existeEmail = await this.prisma.pessoa.findUnique({
        where: {
          email: createPessoaDto.email,
        },
      });

      if (existeEmail) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    return this.prisma.pessoa.create({
      data: {
        ...createPessoaDto,

        // horario sem 00h para evitar erros
        dataNascimento: new Date(`${createPessoaDto.dataNascimento}T00:00:00`),

        conjuge: createPessoaDto.conjuge
          ? (createPessoaDto.conjuge as unknown as Prisma.InputJsonValue)
          : undefined,

        filhos: createPessoaDto.filhos
          ? (createPessoaDto.filhos as unknown as Prisma.InputJsonValue)
          : undefined,

        movimentosPastorais: createPessoaDto.movimentosPastorais ?? [],
      },
    });
  }

  async findAll() {
    const pessoas = await this.prisma.pessoa.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return pessoas.map((pessoa) => ({
      id: pessoa.id,
      nomeCompleto: pessoa.nomeCompleto,
      dataNascimento: pessoa.dataNascimento.toISOString().split('T')[0],
      bairro: pessoa.bairro,
      cidade: pessoa.cidade,

      conjuge: pessoa.conjuge
        ? {
            nome: (pessoa.conjuge as { nome: string; dataNascimento: string })
              .nome,
            dataNascimento: (
              pessoa.conjuge as { nome: string; dataNascimento: string }
            ).dataNascimento,
          }
        : null,

      filhos: Array.isArray(pessoa.filhos)
        ? pessoa.filhos.map((f: any) => ({
            nome: f.nome,
            dataNascimento: f.dataNascimento,
          }))
        : [],

      movimentosPastorais: pessoa.movimentosPastorais ?? [],
    }));
  }

  async findOne(id: string) {
    const pessoa = await this.prisma.pessoa.findUnique({
      where: {
        id,
      },
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    return pessoa;
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pessoa.delete({
      where: {
        id,
      },
    });
  }
}
