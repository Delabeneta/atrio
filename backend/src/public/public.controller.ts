// src/public/public.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Post('cadastrar-dizimista')
  async cadastrarDizimista(@Body() createPessoaDto: any) {
    console.log('Recebido cadastro público:', createPessoaDto.nomeCompleto);
    return this.publicService.cadastrarDizimista(createPessoaDto);
  }
}
