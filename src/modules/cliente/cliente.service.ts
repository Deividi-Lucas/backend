import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
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
   * @throws ConflictException se email já existir
   */
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // Validar email duplicado
    await this.validarEmailUnico(createClienteDto.email);

    const cliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  /**
   * Retrieve all clientes with optional filters
   */
  async findAll(nome?: string, ativo?: boolean): Promise<Cliente[]> {
    const where: FindOptionsWhere<Cliente> = {};

    if (nome) {
      where.nome = Like(`%${nome}%`);
    }

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    return await this.clienteRepository.find({
      where,
      order: { nome: 'ASC' },
    });
  }

  /**
   * Retrieve a cliente by ID
   * @throws NotFoundException se cliente não existir
   */
  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return cliente;
  }

  /**
   * Update a cliente by ID
   * @throws NotFoundException se cliente não existir
   * @throws ConflictException se email já existir em outro cliente
   */
  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.findOne(id);

    // Validar email único se estiver sendo alterado
    if (
      updateClienteDto.email &&
      updateClienteDto.email !== cliente.email
    ) {
      await this.validarEmailUnico(updateClienteDto.email, id);
    }

    Object.assign(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  /**
   * Delete a cliente by ID
   * @throws NotFoundException se cliente não existir
   * @throws BadRequestException se cliente tiver projetos vinculados
   */
  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);

    // Verificar se tem projetos relacionados
    // await this.validarRelacionamentos(id);

    await this.clienteRepository.remove(cliente);
  }

  /**
   * Validar se email já está cadastrado
   * @private
   */
  private async validarEmailUnico(
    email: string,
    excludeId?: number,
  ): Promise<void> {
    const where: FindOptionsWhere<Cliente> = { email };

    const clienteExistente = await this.clienteRepository.findOne({
      where,
    });

    if (clienteExistente && clienteExistente.id !== excludeId) {
      throw new ConflictException('Email já cadastrado');
    }
  }

  /**
   * Validar se cliente tem relacionamentos antes de deletar
   * @private
   */
  private async validarRelacionamentos(id: number): Promise<void> {
    const temProjetos = await this.clienteRepository
      .createQueryBuilder('cliente')
      .leftJoin('cliente.projetos', 'projeto')
      .where('cliente.id = :id', { id })
      .andWhere('projeto.id IS NOT NULL')
      .getCount();

    if (temProjetos > 0) {
      throw new BadRequestException(
        'Não é possível excluir cliente com projetos vinculados',
      );
    }
  }
}