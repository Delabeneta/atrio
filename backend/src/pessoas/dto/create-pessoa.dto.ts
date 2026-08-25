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
import { Type, Transform } from 'class-transformer';
import { EstadoCivil, FrequenciaMissa } from '@prisma/client';

class ConjugeDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  nome!: string;

  @IsDateString()
  @IsOptional()
  dataNascimento?: string;
}

class FilhoDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  nome!: string;

  @IsDateString()
  dataNascimento!: string;
}

export class CreatePessoaDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  nomeCompleto!: string;

  @IsDateString()
  dataNascimento!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value : undefined))
  @IsString()
  @IsOptional()
  telefone?: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  @IsOptional()
  bairro?: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsString()
  @IsOptional()
  organizationId?: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
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

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  @IsOptional()
  movimentosPastorais?: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  situacaoDizimista?: string;
}
