import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EstadoCivil,
  FrequenciaMissa,
  MovimentoPastoral,
} from '@prisma/client';
import { ConjugeDto } from './conjuge.dto';
import { FilhoDto } from './filho.dto';

export class CreatePessoaDto {
  @IsString()
  nomeCompleto!: string;

  @IsDateString()
  dataNascimento!: string;

  @IsEnum(EstadoCivil)
  @IsOptional()
  estadoCivil?: EstadoCivil;

  @IsEnum(FrequenciaMissa)
  @IsOptional()
  frequenciaMissa?: FrequenciaMissa;

  @IsArray()
  @IsEnum(MovimentoPastoral, { each: true })
  @IsOptional()
  movimentosPastorais?: MovimentoPastoral[];

  @IsString()
  @IsOptional()
  codigoDizimista?: string;

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
  cidade?: string;

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

  @ValidateNested()
  @Type(() => ConjugeDto)
  @IsOptional()
  conjuge?: ConjugeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilhoDto)
  @IsOptional()
  filhos?: FilhoDto[];

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
  observacoes?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
