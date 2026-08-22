// src/organizations/dto/create-organization.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  nome!: string;

  @IsString()
  @IsOptional()
  paroquiaId?: string;

  @IsString()
  @IsOptional()
  coordenadorId?: string;

  @IsNumber()
  @IsOptional()
  ultimoCodigoDizimista?: number;
}
