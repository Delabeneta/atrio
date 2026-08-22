// src/pessoas/pessoas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AprovarPendenteDto } from './dto/aprovar-pendente.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('pessoas')
@UseGuards(AuthGuard, RolesGuard)
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  // LIDER pode ver os fiéis da própria comunidade
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COORDENADOR, Role.LIDER)
  findAll(@Request() req) {
    return this.pessoasService.findAll(req.user);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COORDENADOR, Role.LIDER)
  findOne(@Param('id') id: string, @Request() req) {
    return this.pessoasService.findOne(id, req.user);
  }

  // LIDER pode cadastrar fiéis na própria comunidade
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COORDENADOR, Role.LIDER)
  create(@Body() createPessoaDto: CreatePessoaDto, @Request() req) {
    return this.pessoasService.create(createPessoaDto, req.user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COORDENADOR)
  update(
    @Param('id') id: string,
    @Body() updatePessoaDto: UpdatePessoaDto,
    @Request() req,
  ) {
    return this.pessoasService.update(id, updatePessoaDto, req.user);
  }

  // LIDER não exclui (mantém a restrição já existente no service)
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COORDENADOR)
  remove(@Param('id') id: string, @Request() req) {
    return this.pessoasService.remove(id, req.user);
  }

  // COORDENADOR agora pode aprovar/rejeitar fiéis da própria comunidade
  @Patch(':id/aprovar')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COORDENADOR)
  aprovarPendente(
    @Param('id') id: string,
    @Body() dto: AprovarPendenteDto,
    @Request() req,
  ) {
    return this.pessoasService.aprovarPendente(id, dto, req.user);
  }

  @Get('pendentes/aprovar')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COORDENADOR)
  getPendentes(@Request() req) {
    return this.pessoasService.getPendentes(req.user);
  }
}
