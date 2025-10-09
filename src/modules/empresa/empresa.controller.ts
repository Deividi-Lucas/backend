import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  /**
   * POST /empresas
   * Criar nova empresa
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(ValidationPipe) createEmpresaDto: CreateEmpresaDto,
  ) {
    return this.empresaService.create(createEmpresaDto);
  }

  /**
   * GET /empresas
   * Listar todas as empresas
   * Query params: ?nome=xxx&ativo=true
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.empresaService.findAll();
  }

  /**
   * GET /empresas/statistics
   * Obter estatísticas
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  getStatistics() {
    return this.empresaService.getStatistics();
  }

  /**
   * GET /empresas/cnpj/:cnpj
   * Buscar por CNPJ
   */
  @Get('cnpj/:cnpj')
  @HttpCode(HttpStatus.OK)
  findByCnpj(@Param('cnpj') cnpj: string) {
    return this.empresaService.findByCnpj(cnpj);
  }

  /**
   * GET /empresas/:id
   * Buscar empresa por ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.empresaService.findOne(id);
  }

  /**
   * PATCH /empresas/:id
   * Atualizar empresa
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateEmpresaDto: UpdateEmpresaDto,
  ) {
    return this.empresaService.update(id, updateEmpresaDto);
  }

  /**
   * PATCH /empresas/:id/reativar
   * Reativar empresa
   */
  @Patch(':id/reativar')
  @HttpCode(HttpStatus.OK)
  reativar(@Param('id', ParseIntPipe) id: number) {
    return this.empresaService.reativar(id);
  }

  /**
   * DELETE /empresas/:id
   * Desativar empresa (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.empresaService.remove(id);
  }

  /**
   * DELETE /empresas/:id/hard
   * Deletar empresa permanentemente
   */
  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.empresaService.hardDelete(id);
  }
}