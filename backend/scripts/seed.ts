// scripts/setup-inicial.ts
//
// Roda uma única vez, depois da migration, para:
// 1. Criar a Paróquia única do sistema.
// 2. Criar o primeiro usuário SUPER_ADMIN (sem vínculo de comunidade).
//
// Como rodar:
//   npx ts-node scripts/setup-inicial.ts
// (ou "npx tsx scripts/setup-inicial.ts" se o projeto usar tsx)

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const NOVA_SENHA = 'jesus33'; // ← Altere aqui se quiser outra senha

  console.log(`\n🔐 ATUALIZANDO SENHA PARA: ${NOVA_SENHA}\n`);

  // Buscar todos os admins
  const admins = await prisma.user.findMany({
    where: {
      role: {
        in: ['SUPER_ADMIN', 'ADMIN'],
      },
    },
  });

  if (admins.length === 0) {
    console.log('❌ Nenhum ADMIN ou SUPER_ADMIN encontrado!');
    return;
  }

  console.log(`📋 Encontrados ${admins.length} administradores:\n`);
  admins.forEach((a) =>
    console.log(`  - ${a.username} (${a.nome}) - ${a.role}`),
  );

  const hash = await bcrypt.hash(NOVA_SENHA, 10);
  let atualizados = 0;

  for (const admin of admins) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hash },
    });
    console.log(`  ✅ ${admin.username} atualizado!`);
    atualizados++;
  }

  console.log(`\n✅ ${atualizados} usuários atualizados!`);
  console.log(`🔑 Nova senha: ${NOVA_SENHA}`);
  console.log(`👤 Usuários: ${admins.map((a) => a.username).join(', ')}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
