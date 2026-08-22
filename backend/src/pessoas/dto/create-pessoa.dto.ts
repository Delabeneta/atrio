// src/pessoas/dto/create-pessoa.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoCivil, FrequenciaMissa } from '@prisma/client';

class ConjugeDto {
  @IsString()
  nome!: string;

  @IsDateString()
  @IsOptional()
  dataNascimento!: string;
}

class FilhoDto {
  @IsString()
  nome!: string;

  @IsDateString()
  dataNascimento!: string;
}

export class CreatePessoaDto {
  @IsString()
  nomeCompleto!: string;

  @IsDateString()
  dataNascimento!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  // Antes era `comunidadeParticipa: string` (texto livre).
  // Agora a pessoa seleciona uma comunidade já cadastrada.
  @IsString()
  @IsOptional()
  organizationId?: string;

  @IsString()
  @IsOptional()
  comunidadeContribui?: string;

  @IsBoolean()
  @IsOptional()
  ehDizimista?: boolean;

  @IsEnum(EstadoCivil)
  @IsOptional()
  estadoCivil?: EstadoCivil;

  @IsBoolean()
  @IsOptional()
  batizado?: boolean;

  @IsBoolean()
  @IsOptional()
  desejaBatismo?: boolean;

  @IsBoolean()
  @IsOptional()
  catequista?: boolean;

  @IsBoolean()
  @IsOptional()
  desejaCatequese?: boolean;

  @IsBoolean()
  @IsOptional()
  confessaRegularmente?: boolean;

  @IsEnum(FrequenciaMissa)
  @IsOptional()
  frequenciaMissa?: FrequenciaMissa;

  @IsBoolean()
  @IsOptional()
  temEucaristia?: boolean;

  @IsBoolean()
  @IsOptional()
  temCrisma?: boolean;

  @IsBoolean()
  @IsOptional()
  temMatrimonio?: boolean;

  @IsString()
  @IsOptional()
  codigoDizimista?: string;

  @ValidateNested()
  @Type(() => ConjugeDto)
  @IsOptional()
  conjuge?: ConjugeDto;

  @ValidateNested({ each: true })
  @Type(() => FilhoDto)
  @IsOptional()
  filhos?: FilhoDto[];

  // Antes era `MovimentoPastoral[]` (enum). Agora texto livre único —
  // a pessoa pode digitar mais de uma pastoral, tudo nesta string.
  @IsString()
  @IsOptional()
  movimentosPastorais?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  status?: string;

  @IsString()
  @IsOptional()
  situacaoDizimista?: string;
}
