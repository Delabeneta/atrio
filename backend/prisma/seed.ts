// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar usuários
  const adminPassword = await bcrypt.hash('1234', 10);
  const memberPassword = await bcrypt.hash('1234', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      name: 'Administrador',
    },
  });

  await prisma.user.upsert({
    where: { username: 'membro' },
    update: {},
    create: {
      username: 'membro',
      password: memberPassword,
      role: 'member',
      name: 'Membro',
    },
  });

  // Criar pessoas de exemplo
  const pessoa1 = await prisma.pessoa.create({
    data: {
      nomeCompleto: 'João da Silva',
      dataNascimento: new Date('1990-05-10'),
      telefone: '(21) 99999-9999',
      email: 'joao@email.com',
      comunidadeParticipa: 'Matriz',
      comunidadeContribui: 'Matriz',
      estadoCivil: 'solteiro',
      batizado: true,
      catequista: true,
      sacramentos: {
        eucaristia: true,
        crisma: true,
        matrimonio: false,
      },
      confessaRegularmente: true,
      frequenciaMissa: 'Semanal',
      movimentosPastorais: ['Pastoral da Música'],
    },
  });

  const pessoa2 = await prisma.pessoa.create({
    data: {
      nomeCompleto: 'Maria Oliveira',
      dataNascimento: new Date('1985-03-15'),
      telefone: '(21) 98888-7777',
      email: 'maria@email.com',
      comunidadeParticipa: 'São José',
      comunidadeContribui: 'São José',
      estadoCivil: 'casado',
      conjuge: {
        nome: 'Carlos Oliveira',
        dataNascimento: new Date('1983-07-20'),
        dizimista: true,
      },
      filhos: [
        { nome: 'Pedro Oliveira', dataNascimento: new Date('2010-11-05') },
        { nome: 'Ana Oliveira', dataNascimento: new Date('2013-08-18') },
      ],
      batizado: true,
      catequista: true,
      sacramentos: {
        eucaristia: true,
        crisma: true,
        matrimonio: true,
      },
      confessaRegularmente: true,
      frequenciaMissa: 'Semanal',
      movimentosPastorais: ['Pastoral Familiar', 'Catequese'],
    },
  });

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
