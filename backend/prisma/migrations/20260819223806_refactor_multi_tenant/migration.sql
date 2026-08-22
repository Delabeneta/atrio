-- ============================================
-- 1. LIMPEZA (idempotente — seguro rodar mesmo se já rodou antes)
-- ============================================
DROP TABLE IF EXISTS "AuditLog" CASCADE;
DROP TABLE IF EXISTS "Organization" CASCADE;
DROP TABLE IF EXISTS "Paroquia" CASCADE;
DROP TYPE IF EXISTS "Role";

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'nome') THEN
    ALTER TABLE "User" RENAME COLUMN "nome" TO "name";
  END IF;
END $$;

ALTER TABLE "User" DROP COLUMN IF EXISTS "email";
ALTER TABLE "User" DROP COLUMN IF EXISTS "organizationId";

ALTER TABLE "Pessoa" DROP COLUMN IF EXISTS "organizationId";
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pessoa' AND column_name = 'comunidadeParticipa') THEN
    ALTER TABLE "Pessoa" ADD COLUMN "comunidadeParticipa" TEXT;
  END IF;
END $$;

-- ============================================
-- 2. CONVERTER Pessoa.movimentosPastorais ANTES de dropar o enum
--    (a coluna precisa parar de depender do tipo antes do DROP TYPE)
-- ============================================
DROP INDEX IF EXISTS "Pessoa_comunidadeParticipa_idx";
ALTER TABLE "Pessoa" DROP COLUMN IF EXISTS "comunidadeParticipa";
ALTER TABLE "Pessoa" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Pessoa' AND column_name = 'movimentosPastorais' AND data_type <> 'text'
  ) THEN
    ALTER TABLE "Pessoa" DROP COLUMN "movimentosPastorais";
    ALTER TABLE "Pessoa" ADD COLUMN "movimentosPastorais" TEXT;
  END IF;
END $$;

-- Agora sim: nenhuma coluna depende mais do enum, pode dropar.
DROP TYPE IF EXISTS "MovimentoPastoral";

-- ============================================
-- 3. CRIAR TUDO DO ZERO (com FKs)
-- ============================================
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'COORDENADOR', 'LIDER');

CREATE TABLE "Paroquia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Paroquia_nome_idx" ON "Paroquia"("nome");
CREATE UNIQUE INDEX "Paroquia_adminId_key" ON "Paroquia"("adminId");

CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "paroquiaId" TEXT NOT NULL,
    "coordenadorId" TEXT,
    "proximoCodigoDizimista" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Organization_nome_idx" ON "Organization"("nome");
CREATE INDEX "Organization_paroquiaId_idx" ON "Organization"("paroquiaId");
CREATE UNIQUE INDEX "Organization_coordenadorId_key" ON "Organization"("coordenadorId");

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- ============================================
-- 4. ALTERAR User E índices restantes de Pessoa
-- ============================================
ALTER TABLE "User" RENAME COLUMN "name" TO "nome";
ALTER TABLE "User" ADD COLUMN "email" TEXT;
ALTER TABLE "User" ADD COLUMN "organizationId" TEXT;

UPDATE "User" SET "role" = 'COORDENADOR' WHERE "role" = 'admin';
UPDATE "User" SET "role" = 'LIDER' WHERE "role" = 'member';
UPDATE "User" SET "role" = 'LIDER' WHERE "role" NOT IN ('COORDENADOR', 'LIDER');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING ("role"::text::"Role");
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'LIDER';

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

CREATE INDEX "Pessoa_organizationId_idx" ON "Pessoa"("organizationId");

-- ============================================
-- 5. FOREIGN KEYS
-- ============================================
ALTER TABLE "Paroquia" ADD CONSTRAINT "Paroquia_adminId_fkey"
    FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Organization" ADD CONSTRAINT "Organization_paroquiaId_fkey"
    FOREIGN KEY ("paroquiaId") REFERENCES "Paroquia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Organization" ADD CONSTRAINT "Organization_coordenadorId_fkey"
    FOREIGN KEY ("coordenadorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;