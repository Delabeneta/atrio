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
import { Transform, Type } from 'class-transformer';
import { EstadoCivil, FrequenciaMissa } from '@prisma/client';

class ConjugeDto {
  @Transform(({ value }) => value?.toUpperCase())
  @IsString()
  nome!: string;

  @IsDateString()
  @IsOptional()
  dataNascimento!: string;
}

class FilhoDto {
  @Transform(({ value }) => value?.toUpperCase())
  @IsString()
  nome!: string;

  @IsDateString()
  dataNascimento!: string;
}

export class CreatePessoaDto {
  @Transform(({ value }) => value?.toUpperCase())
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

  @Transform(({ value }) => value?.toUpperCase())
  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  cep?: string;

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

  @Transform(({ value }) => value?.toUpperCase())
  @ValidateNested()
  @Type(() => ConjugeDto)
  @IsOptional()
  conjuge?: ConjugeDto;

  @ValidateNested({ each: true })
  @Type(() => FilhoDto)
  @IsOptional()
  filhos?: FilhoDto[];

  @Transform(({ value }) => value?.toUpperCase())
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
