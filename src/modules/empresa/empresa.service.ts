import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  /**
   * Criar nova empresa
   */
  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    // Validar se CNPJ já existe
    const cnpjExiste = await this.empresaRepository.findOne({
      where: { cnpj: createEmpresaDto.cnpj },
    });

    if (cnpjExiste) {
      throw new ConflictException(
        `CNPJ ${createEmpresaDto.cnpj} já está cadastrado`,
      );
    }

    const empresa = this.empresaRepository.create(createEmpresaDto);
    return await this.empresaRepository.save(empresa);
  }

  /**
   * Listar todas as empresas ativas
   */
  async findAll(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      where: { ativo: true },
      order: { nome: 'ASC' },
    });
  }

  /**
   * Buscar empresa por ID
   */
  async findOne(id: number): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { id }
      // relations: ['projetos'],
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    return empresa;
  }

  /**
   * Buscar empresa por CNPJ
   */
  async findByCnpj(cnpj: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { cnpj },
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com CNPJ ${cnpj} não encontrada`);
    }

    return empresa;
  }

  /**
   * Buscar empresas com filtros
   */
  async search(nome?: string, ativo?: boolean): Promise<Empresa[]> {
    const where: any = {};

    if (nome) {
      where.nome = Like(`%${nome}%`);
    }

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    return await this.empresaRepository.find({
      where,
      order: { nome: 'ASC' },
    });
  }

  /**
   * Atualizar empresa
   */
  async update(
    id: number,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    const empresa = await this.findOne(id);

    // Se estiver atualizando CNPJ, validar unicidade
    if (updateEmpresaDto.cnpj && updateEmpresaDto.cnpj !== empresa.cnpj) {
      const cnpjExiste = await this.empresaRepository.findOne({
        where: { cnpj: updateEmpresaDto.cnpj },
      });

      if (cnpjExiste) {
        throw new ConflictException(
          `CNPJ ${updateEmpresaDto.cnpj} já está cadastrado`,
        );
      }
    }

    Object.assign(empresa, updateEmpresaDto);
    return await this.empresaRepository.save(empresa);
  }

  /**
   * Desativar empresa (soft delete)
   */
  async remove(id: number): Promise<void> {
    const empresa = await this.findOne(id);
    empresa.ativo = false;
    await this.empresaRepository.save(empresa);
  }

  /**
   * Deletar empresa permanentemente
   */
  async hardDelete(id: number): Promise<void> {
    const result = await this.empresaRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }
  }

  /**
   * Obter estatísticas
   */
  async getStatistics(): Promise<{
    total: number;
    ativas: number;
    inativas: number;
  }> {
    const total = await this.empresaRepository.count();
    const ativas = await this.empresaRepository.count({
      where: { ativo: true },
    });

    return {
      total,
      ativas,
      inativas: total - ativas,
    };
  }

  /**
   * Reativar empresa
   */
  async reativar(id: number): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({ where: { id } });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }

    empresa.ativo = true;
    return await this.empresaRepository.save(empresa);
  }
}