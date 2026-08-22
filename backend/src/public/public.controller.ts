// src/public/public.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreatePessoaDto } from '../pessoas/dto/create-pessoa.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('organizations')
  listarComunidades() {
    return this.publicService.listarComunidades();
  }

  @Post('cadastrar-dizimista')
  async cadastrarDizimista(@Body() dto: CreatePessoaDto) {
    return this.publicService.cadastrarDizimista(dto);
  }
}
