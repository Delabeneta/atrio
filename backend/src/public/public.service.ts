// src/public/public.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async cadastrarDizimista(data: any) {
    console.log('Salvando no banco:', data.nomeCompleto);

    const movimentosValidos = [
      'PastoralFamiliar',
      'PastoralDizimista',
      'GrupoOracao',
      'Liturgia',
      'Catequese',
      'Coral',
      'Acolitos',
      'MinistroEucaristico',
      'LegiaoMaria',
    ];

    const movimentosPastorais = (data.movimentosPastorais || [])
      .filter((m) => movimentosValidos.includes(m))
      .slice(0, 10);

    return this.prisma.pessoa.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        dataNascimento: new Date(data.dataNascimento),
        telefone: data.telefone,
        endereco: data.endereco,
        bairro: data.bairro,
        estadoCivil: data.estadoCivil,
        ehDizimista: false,
        status: 'pendente',
        situacaoDizimista: data.situacaoDizimista || 'DesejaSerDizimista',
        movimentosPastorais: movimentosPastorais,
        filhos: data.filhos || [],
        conjuge: data.conjuge,
        observacoes: `[PENDENTE] ${data.observacoes || ''}`,
      },
    });
  }
}
