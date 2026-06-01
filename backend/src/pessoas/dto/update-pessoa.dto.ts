/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePessoaDto } from './create-pessoa.dto';

export class UpdatePessoaDto extends PartialType(CreatePessoaDto) {}
