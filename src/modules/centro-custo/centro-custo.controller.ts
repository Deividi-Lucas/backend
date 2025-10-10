import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CentroCustoService } from './centro-custo.service';
import { CreateCentroCustoDto } from './dto/create-centro-custo.dto';
import { UpdateCentroCustoDto } from './dto/update-centro-custo.dto';
import { CentroCusto } from './entities/centro-custo.entity';

@ApiTags('Centros de Custos')
@Controller('centros-custo')
export class CentroCustoController {
  constructor(private readonly centroCustoService: CentroCustoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo centro de custo' })
  @ApiResponse({ status: 201, description: 'Centro de custo criado com sucesso', type: CentroCusto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async create(@Body() createCentroCustoDto: CreateCentroCustoDto): Promise<CentroCusto> {
    return await this.centroCustoService.create(createCentroCustoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos os centros de custo' })
  @ApiResponse({ status: 200, description: 'Lista de centros de custo', type: [CentroCusto] })
  async findAll(): Promise<CentroCusto[]> {
    return await this.centroCustoService.findAll();
  }

  @Get('empresa/:empresaId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar centros de custo de uma empresa' })
  @ApiParam({ name: 'empresaId', type: 'number', description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de centros de custo da empresa', type: [CentroCusto] })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  async findByEmpresa(@Param('empresaId', ParseIntPipe) empresaId: number): Promise<CentroCusto[]> {
    return await this.centroCustoService.findByEmpresa(empresaId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar centro de custo por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do centro de custo' })
  @ApiResponse({ status: 200, description: 'Centro de custo encontrado', type: CentroCusto })
  @ApiResponse({ status: 404, description: 'Centro de custo não encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CentroCusto> {
    return await this.centroCustoService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar centro de custo' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do centro de custo' })
  @ApiResponse({ status: 200, description: 'Centro de custo atualizado', type: CentroCusto })
  @ApiResponse({ status: 404, description: 'Centro de custo não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCentroCustoDto: UpdateCentroCustoDto,
  ): Promise<CentroCusto> {
    return await this.centroCustoService.update(id, updateCentroCustoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar centro de custo (soft delete)' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID do centro de custo' })
  @ApiResponse({ status: 204, description: 'Centro de custo deletado' })
  @ApiResponse({ status: 404, description: 'Centro de custo não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.centroCustoService.remove(id);
  }
}