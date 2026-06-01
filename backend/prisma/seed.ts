// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Pedro da Silva (com conjuge e filhos)
  const pessoa1 = await prisma.pessoa.create({
    data: {
      codigoDizimista: '005',
      nomeCompleto: 'Pedro da Silva',
      dataNascimento: new Date('1985-05-10T00:00:00'),
      email: 'pedro@email.com',
      telefone: '(21)99999-1111',
      bairro: 'Centro',
      cidade: 'Magé',
      cep: '25900-000',
      comunidadeParticipa: 'Matriz',
      comunidadeContribui: 'Matriz',
      ehDizimista: true,
      estadoCivil: 'Casado',
      batizado: true,
      catequista: false,
      desejaCatequese: false,
      desejaBatismo: false,
      confessaRegularmente: true,
      frequenciaMissa: 'Semanal',
      temEucaristia: true,
      temCrisma: true,
      temMatrimonio: true,
      movimentosPastorais: ['Liturgia', 'Coral'],
      observacoes: 'Família participa ativamente da comunidade.',
      ativo: true,

      // Criar conjuge relacionado
      conjuge: {
        create: {
          nome: 'Maria da Silva',
          dataNascimento: new Date('1987-03-15T00:00:00'),
          dizimista: true,
        },
      },

      // Criar filhos relacionados
      filhos: {
        create: [
          {
            nome: 'Pedro da Silva',
            dataNascimento: new Date('2012-08-20T00:00:00'),
          },
          {
            nome: 'Ana da Silva',
            dataNascimento: new Date('2015-01-10T00:00:00'),
          },
        ],
      },
    },
  });

  console.log(`Criado: ${pessoa1.nomeCompleto}`);

  // 2. Carlos Eduardo (com conjuge, sem filhos)
  const pessoa2 = await prisma.pessoa.create({
    data: {
      codigoDizimista: '002',
      nomeCompleto: 'Carlos Eduardo',
      dataNascimento: new Date('1992-11-22T00:00:00'),
      email: 'carlos@email.com',
      telefone: '(21)98888-2222',
      bairro: 'Piabetá',
      cidade: 'Magé',
      comunidadeParticipa: 'São José',
      comunidadeContribui: 'São José',
      ehDizimista: true,
      estadoCivil: 'Casado',
      batizado: true,
      confessaRegularmente: true,
      frequenciaMissa: 'Semanal',
      temEucaristia: true,
      temCrisma: true,
      temMatrimonio: true,
      movimentosPastorais: ['PastoralDizimista'],
      ativo: true,

      conjuge: {
        create: {
          nome: 'Fernanda Eduardo',
          dataNascimento: new Date('1994-06-18T00:00:00'),
          dizimista: false,
        },
      },
    },
  });

  console.log(`Criado: ${pessoa2.nomeCompleto}`);

  // 3. Helena Souza (viúva com filhos)
  const pessoa3 = await prisma.pessoa.create({
    data: {
      codigoDizimista: '003',
      nomeCompleto: 'Helena Souza',
      dataNascimento: new Date('1970-02-12T00:00:00'),
      email: 'helena@email.com',
      telefone: '(21)97777-3333',
      bairro: 'Fragoso',
      cidade: 'Magé',
      comunidadeParticipa: 'Santa Rita',
      ehDizimista: true,
      estadoCivil: 'Viuvo',
      batizado: true,
      frequenciaMissa: 'Semanal',
      temEucaristia: true,
      temCrisma: true,
      movimentosPastorais: ['GrupoOracao'],
      observacoes: 'Participa do grupo de oração há muitos anos.',
      ativo: true,

      filhos: {
        create: [
          {
            nome: 'Lucas Souza',
            dataNascimento: new Date('1998-09-12T00:00:00'),
          },
          {
            nome: 'Juliana Souza',
            dataNascimento: new Date('2001-04-25T00:00:00'),
          },
        ],
      },
    },
  });

  console.log(`Criado: ${pessoa3.nomeCompleto}`);

  // 4. Rafael Martins (sem conjuge e sem filhos)
  const pessoa4 = await prisma.pessoa.create({
    data: {
      nomeCompleto: 'Rafael Martins',
      dataNascimento: new Date('2000-07-30T00:00:00'),
      telefone: '(21)96666-4444',
      bairro: 'Centro',
      cidade: 'Magé',
      ehDizimista: false,
      estadoCivil: 'Solteiro',
      batizado: true,
      frequenciaMissa: 'Eventual',
      movimentosPastorais: ['Acolitos'],
      ativo: true,
    },
  });

  console.log(`Criado: ${pessoa4.nomeCompleto}`);

  // 5. Patrícia Oliveira (cadastro simples)
  const pessoa5 = await prisma.pessoa.create({
    data: {
      codigoDizimista: '004',
      nomeCompleto: 'Patrícia Oliveira',
      dataNascimento: new Date('1988-09-14T00:00:00'),
      email: 'patricia@email.com',
      cidade: 'Magé',
      ehDizimista: true,
      estadoCivil: 'Divorciado',
      batizado: true,
      temEucaristia: true,
      frequenciaMissa: 'Diaria',
      movimentosPastorais: ['Catequese', 'Liturgia'],
      ativo: false,
    },
  });

  console.log(`Criado: ${pessoa5.nomeCompleto}`);

  console.log('\nSeed executada com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
