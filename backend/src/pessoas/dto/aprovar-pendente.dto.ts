// src/pessoas/dto/aprovar-pendente.dto.ts
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AprovarPendenteDto {
  @IsBoolean()
  aprovado!: boolean;

  @IsString()
  @IsOptional()
  observacao?: string;
}
