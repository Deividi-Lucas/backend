import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ValidationPipe, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';


@Controller('clientes')
expect class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}
    /**
     * Create a new cliente
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body(new ValidationPipe()) createClienteDto: CreateClienteDto) {
      return this.clienteService.create(createClienteDto);
    }

    /**
     * Retrieve all clientes
     * Optional query params: ?nome=xxx&ativo=true
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
      return this.clienteService.findAll();
    }
    /**
     * Retrieve a cliente by ID
     */
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.clienteService.findOne(id);
    }
    /**
     * Update a cliente by ID
     */
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateClienteDto: UpdateClienteDto,
    ) {
      return this.clienteService.update(id, updateClienteDto);
    }
    /**
     * Delete a cliente by ID
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.clienteService.remove(id);
    }
}   
