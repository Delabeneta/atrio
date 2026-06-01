/*
  Warnings:

  - You are about to drop the column `conjugeId` on the `Pessoa` table. All the data in the column will be lost.
  - You are about to drop the column `outrosMovimentos` on the `Pessoa` table. All the data in the column will be lost.
  - You are about to drop the `Filho` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PessoasMovimentos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigoDizimista]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Filho" DROP CONSTRAINT "Filho_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "Filho" DROP CONSTRAINT "Filho_responsavelId_fkey";

-- DropForeignKey
ALTER TABLE "Pessoa" DROP CONSTRAINT "Pessoa_conjugeId_fkey";

-- DropForeignKey
ALTER TABLE "PessoasMovimentos" DROP CONSTRAINT "PessoasMovimentos_pessoaId_fkey";

-- DropIndex
DROP INDEX "Pessoa_conjugeId_key";

-- DropIndex
DROP INDEX "Pessoa_ehDizimista_idx";

-- DropIndex
DROP INDEX "Pessoa_email_idx";

-- AlterTable
ALTER TABLE "Pessoa" DROP COLUMN "conjugeId",
DROP COLUMN "outrosMovimentos",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "codigoDizimista" TEXT,
ADD COLUMN     "conjuge" JSONB,
ADD COLUMN     "filhos" JSONB,
ADD COLUMN     "movimentosPastorais" "MovimentoPastoral"[],
ADD COLUMN     "observacoes" TEXT;

-- DropTable
DROP TABLE "Filho";

-- DropTable
DROP TABLE "PessoasMovimentos";

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_codigoDizimista_key" ON "Pessoa"("codigoDizimista");
