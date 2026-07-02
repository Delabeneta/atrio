import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AprovarPendenteDto } from './dto/aprovar-pendente.dto';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @Get()
  findAll(@Query('incluirInativos') incluirInativos?: string) {
    const incluir = incluirInativos === 'true';
    return this.pessoasService.findAll(incluir);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePessoaDto: UpdatePessoaDto) {
    return this.pessoasService.update(id, updatePessoaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoasService.remove(id);
  }

  @Patch(':id/reativar')
  reativar(@Param('id') id: string) {
    return this.pessoasService.update(id, { ativo: true });
  }
  @Get('pendentes/aprovar')
  async listarPendentes() {
    return this.pessoasService.listarPendentes();
  }

  @Patch(':id/aprovar')
  async aprovarPendente(
    @Param('id') id: string,
    @Body() aprovarDto: AprovarPendenteDto,
  ) {
    return this.pessoasService.aprovarPendente(id, aprovarDto);
  }
}
