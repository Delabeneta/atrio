// src/paroquias/paroquias.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ParoquiasService } from './paroquias.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('paroquias')
@UseGuards(AuthGuard) // qualquer usuário logado pode ler (sem restrição de role)
export class ParoquiasController {
  constructor(private readonly paroquiasService: ParoquiasService) {}

  @Get()
  findAll() {
    return this.paroquiasService.findAll();
  }
}
