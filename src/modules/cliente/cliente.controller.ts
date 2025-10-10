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
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@ApiTags('Clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  /**
   * Create a new cliente
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
    type: Cliente,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email ou documento já cadastrado' })
  async create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return await this.clienteService.create(createClienteDto);
  }

  /**
   * Retrieve all clientes
   * Optional query params: ?nome=xxx&ativo=true
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'ativo', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso',
    type: [Cliente],
  })
  async findAll(
    @Query('nome') nome?: string,
    @Query('ativo', new ParseBoolPipe({ optional: true })) ativo?: boolean,
  ): Promise<Cliente[]> {
    return await this.clienteService.findAll(nome, ativo);
  }

  /**
   * Retrieve a cliente by ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    type: Cliente,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
    return await this.clienteService.findOne(id);
  }

  /**
   * Update a cliente by ID
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
    type: Cliente,
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 409, description: 'Email ou documento já cadastrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    return await this.clienteService.update(id, updateClienteDto);
  }

  /**
   * Delete a cliente by ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar cliente' })
  @ApiResponse({ status: 204, description: 'Cliente deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({
    status: 400,
    description: 'Cliente possui projetos vinculados',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.clienteService.remove(id);
  }
}
