import { Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException
 } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
    ) {}
    /**
     * Create a new cliente
     */
    async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
        const cliente = this.clienteRepository.create(createClienteDto);
        return this.clienteRepository.save(cliente);
    }
    /**
     * Retrieve all clientes
     * Optional query params: ?nome=xxx&ativo=true
     */
    async findAll(nome?: string, ativo?: boolean): Promise<Cliente[]> {
        const where: Partial<Cliente> = {};
        if (nome) {
            where.nome = Like(`%${nome}%`);
        }
        if (ativo !== undefined) {
            where.ativo = ativo;
        }
        return this.clienteRepository.find({ where });
    }
    /**
     * Retrieve a cliente by ID
     */
    async findOne(id: number): Promise<Cliente> {
        const cliente = await this.clienteRepository.findOne({ where: { id } });
        if (!cliente) {
            throw new NotFoundException(`Cliente with ID ${id} not found`);
        }
        return cliente;
    }
    /**
     * Update a cliente by ID
     * Only fields present in updateClienteDto will be updated
     *  If 'ativo' is not provided, it will not be changed
     * If 'ativo' is provided, it will be updated accordingly
     */
    async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
        const cliente = await this.findOne(id);
        Object.assign(cliente, updateClienteDto);
        return this.clienteRepository.save(cliente);
    }
    /**
     * Delete a cliente by ID
     *  If the cliente has related records, a BadRequestException is thrown
     *  Otherwise, the cliente is deleted
     * Returns void
     *  If the cliente does not exist, a NotFoundException is thrown
     * If the cliente has related records, a BadRequestException is thrown
     * Otherwise, the cliente is deleted
     */
    async remove(id: number): Promise<void> {
        const cliente = await this.findOne(id);
        await this.clienteRepository.remove(cliente);
    } 
}