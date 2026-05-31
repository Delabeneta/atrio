-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('Solteiro', 'Casado', 'Viuvo', 'Divorciado');

-- CreateEnum
CREATE TYPE "FrequenciaMissa" AS ENUM ('Diaria', 'Semanal', 'Eventual');

-- CreateEnum
CREATE TYPE "MovimentoPastoral" AS ENUM ('PastoralFamiliar', 'PastoralDizimista', 'GrupoOracao', 'Liturgia', 'Catequese', 'Coral', 'Acolitos', 'MinistroEucaristico', 'LegiaoMaria');

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "cep" TEXT,
    "comunidadeParticipa" TEXT,
    "comunidadeContribui" TEXT,
    "ehDizimista" BOOLEAN NOT NULL DEFAULT false,
    "estadoCivil" "EstadoCivil" NOT NULL DEFAULT 'Solteiro',
    "conjugeId" TEXT,
    "batizado" BOOLEAN NOT NULL DEFAULT false,
    "desejaBatismo" BOOLEAN NOT NULL DEFAULT false,
    "catequista" BOOLEAN NOT NULL DEFAULT false,
    "desejaCatequese" BOOLEAN NOT NULL DEFAULT false,
    "confessaRegularmente" BOOLEAN NOT NULL DEFAULT false,
    "frequenciaMissa" "FrequenciaMissa" NOT NULL DEFAULT 'Eventual',
    "temEucaristia" BOOLEAN NOT NULL DEFAULT false,
    "temCrisma" BOOLEAN NOT NULL DEFAULT false,
    "temMatrimonio" BOOLEAN NOT NULL DEFAULT false,
    "outrosMovimentos" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filho" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "pessoaId" TEXT,
    "responsavelId" TEXT NOT NULL,
    "ehDizimista" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PessoasMovimentos" (
    "pessoaId" TEXT NOT NULL,
    "movimento" "MovimentoPastoral" NOT NULL,

    CONSTRAINT "PessoasMovimentos_pkey" PRIMARY KEY ("pessoaId","movimento")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "details" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Backup" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Backup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_conjugeId_key" ON "Pessoa"("conjugeId");

-- CreateIndex
CREATE INDEX "Pessoa_nomeCompleto_idx" ON "Pessoa"("nomeCompleto");

-- CreateIndex
CREATE INDEX "Pessoa_email_idx" ON "Pessoa"("email");

-- CreateIndex
CREATE INDEX "Pessoa_comunidadeParticipa_idx" ON "Pessoa"("comunidadeParticipa");

-- CreateIndex
CREATE INDEX "Pessoa_createdAt_idx" ON "Pessoa"("createdAt");

-- CreateIndex
CREATE INDEX "Pessoa_ehDizimista_idx" ON "Pessoa"("ehDizimista");

-- CreateIndex
CREATE UNIQUE INDEX "Filho_pessoaId_key" ON "Filho"("pessoaId");

-- CreateIndex
CREATE INDEX "Filho_responsavelId_idx" ON "Filho"("responsavelId");

-- CreateIndex
CREATE INDEX "Filho_pessoaId_idx" ON "Filho"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "Log_createdAt_idx" ON "Log"("createdAt");

-- CreateIndex
CREATE INDEX "Log_userId_idx" ON "Log"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Backup_createdAt_idx" ON "Backup"("createdAt");

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_conjugeId_fkey" FOREIGN KEY ("conjugeId") REFERENCES "Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filho" ADD CONSTRAINT "Filho_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filho" ADD CONSTRAINT "Filho_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PessoasMovimentos" ADD CONSTRAINT "PessoasMovimentos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
