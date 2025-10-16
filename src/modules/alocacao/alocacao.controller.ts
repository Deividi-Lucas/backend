import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AlocacaoService } from './alocacao.service';
import { CreateAlocacaoDto } from './dto/create-alocacao.dto';
import { UpdateAlocacaoDto } from './dto/update-alocacao.dto';
import { FilterAlocacaoDto } from './dto/filter-alocacao.dto';
import { AlocacaoEntity } from './entities/alocacao.entity';

@ApiTags('Alocações')
@Controller('alocacoes')
export class AlocacaoController {
  constructor(private readonly alocacaoService: AlocacaoService) {}

  @Post()
  async create(@Body() createAlocacaoDto: CreateAlocacaoDto): Promise<AlocacaoEntity> {
    return this.alocacaoService.create(createAlocacaoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as alocações' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de alocações retornada com sucesso',
    type: [AlocacaoEntity],
  })
  @ApiQuery({ name: 'ferramentaId', required: false, type: Number })
  @ApiQuery({ name: 'centroCustoId', required: false, type: Number })
  @ApiQuery({ name: 'funcionarioId', required: false, type: Number })
  @ApiQuery({ name: 'ativo', required: false, type: Boolean })
  async findAll(@Query() filter: FilterAlocacaoDto): Promise<AlocacaoEntity[]> {
    return await this.alocacaoService.findAll(filter);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar alocação por ID' })
  @ApiParam({ name: 'id', description: 'ID da alocação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Alocação encontrada',
    type: AlocacaoEntity,
  })
  @ApiResponse({ status: 404, description: 'Alocação não encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AlocacaoEntity> {
    return await this.alocacaoService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar alocação' })
  @ApiParam({ name: 'id', description: 'ID da alocação' })
  @ApiResponse({ 
    status: 200, 
    description: 'Alocação atualizada com sucesso',
    type: AlocacaoEntity,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Alocação não encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlocacaoDto: UpdateAlocacaoDto,
  ): Promise<AlocacaoEntity> {
    return await this.alocacaoService.update(id, updateAlocacaoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover alocação (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID da alocação' })
  @ApiResponse({ status: 204, description: 'Alocação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Alocação não encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.alocacaoService.remove(id);
  }
}