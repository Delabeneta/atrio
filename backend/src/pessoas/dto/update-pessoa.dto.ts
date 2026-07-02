// src/pessoas/dto/update-pessoa.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePessoaDto } from './create-pessoa.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePessoaDto extends PartialType(CreatePessoaDto) {
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
