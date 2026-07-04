// src/pessoas/dto/create-pessoa.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  isString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EstadoCivil,
  FrequenciaMissa,
  MovimentoPastoral,
} from '@prisma/client';

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

  @IsString()
  @IsOptional()
  comunidadeParticipa?: string;

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
  codigoDizimista?: string; // Agora é opcional, será gerado automaticamente

  @ValidateNested()
  @Type(() => ConjugeDto)
  @IsOptional()
  conjuge?: ConjugeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilhoDto)
  @IsOptional()
  filhos?: FilhoDto[];

  @IsArray()
  @IsEnum(MovimentoPastoral, { each: true })
  @IsOptional()
  movimentosPastorais?: MovimentoPastoral[];

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  status?: string;
}
