import { PartialType } from '@nestjs/mapped-types';
import { CreatePessoaDto } from './create-pessoa.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePessoaDto extends PartialType(CreatePessoaDto) {
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @IsString()
  @IsOptional()
  comunidadeParticipa?: string;
}
