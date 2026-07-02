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
    "telefone" TEXT,
    "endereco" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "comunidadeParticipa" TEXT,
    "comunidadeContribui" TEXT,
    "situacaoDizimista" TEXT DEFAULT 'DesejaSerDizimista',
    "ehDizimista" BOOLEAN NOT NULL DEFAULT true,
    "estadoCivil" "EstadoCivil" NOT NULL DEFAULT 'Solteiro',
    "batizado" BOOLEAN NOT NULL DEFAULT false,
    "desejaBatismo" BOOLEAN NOT NULL DEFAULT false,
    "catequista" BOOLEAN NOT NULL DEFAULT false,
    "desejaCatequese" BOOLEAN NOT NULL DEFAULT false,
    "confessaRegularmente" BOOLEAN NOT NULL DEFAULT false,
    "frequenciaMissa" "FrequenciaMissa" NOT NULL DEFAULT 'Eventual',
    "temEucaristia" BOOLEAN NOT NULL DEFAULT false,
    "temCrisma" BOOLEAN NOT NULL DEFAULT false,
    "temMatrimonio" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT DEFAULT 'pendente',
    "codigoDizimista" TEXT,
    "conjuge" JSONB,
    "filhos" JSONB,
    "movimentosPastorais" "MovimentoPastoral"[],
    "observacoes" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_codigoDizimista_key" ON "Pessoa"("codigoDizimista");

-- CreateIndex
CREATE INDEX "Pessoa_nomeCompleto_idx" ON "Pessoa"("nomeCompleto");

-- CreateIndex
CREATE INDEX "Pessoa_comunidadeParticipa_idx" ON "Pessoa"("comunidadeParticipa");

-- CreateIndex
CREATE INDEX "Pessoa_createdAt_idx" ON "Pessoa"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
