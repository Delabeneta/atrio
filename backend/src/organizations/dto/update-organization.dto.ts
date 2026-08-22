// src/organizations/dto/update-organization.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
} from 'class-validator';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @IsOptional()
  ultimoCodigoDizimista?: number;

  @IsString()
  @IsOptional()
  coordenadorId?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
