import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCentroCustoDto } from './dto/create-centro-custo.dto';
import { UpdateCentroCustoDto } from './dto/update-centro-custo.dto';
import { CentroCusto } from './entities/centro-custo.entity';
import { Empresa } from '../empresa/entities/empresa.entity';

@Injectable()
export class CentroCustoService {
  constructor(
    @InjectRepository(CentroCusto)
    private centroCustoRepository: Repository<CentroCusto>,

    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
  ) {}

  async findAll(): Promise<CentroCusto[]> {
    return await this.centroCustoRepository.find({
      where: { ativo: true },
      relations: ['empresa'],
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CentroCusto> {
    const centroCusto = await this.centroCustoRepository.findOne({
      where: { id },
      relations: ['empresa'],
    });

    if (!centroCusto) {
      throw new NotFoundException(`Centro de custo com ID ${id} não encontrado`);
    }

    return centroCusto;
  }

  async findByEmpresa(empresaId: number): Promise<CentroCusto[]> {
    const empresa = await this.empresaRepository.findOne({ 
      where: { id: empresaId } 
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${empresaId} não encontrada`);
    }

    return await this.centroCustoRepository.find({
      where: { empresaId, ativo: true },
      relations: ['empresa'],
      order: { nome: 'ASC' },
    });
  }

  async create(createCentroCustoDto: CreateCentroCustoDto): Promise<CentroCusto> {
    // Validar se empresa existe
    const empresa = await this.empresaRepository.findOne({
      where: { id: createCentroCustoDto.empresaId },
    });

    if (!empresa) {
      throw new NotFoundException(
        `Empresa com ID ${createCentroCustoDto.empresaId} não encontrada`
      );
    }

    const centroCusto = this.centroCustoRepository.create(createCentroCustoDto);
    return await this.centroCustoRepository.save(centroCusto);
  }

  async update(
    id: number,
    updateCentroCustoDto: UpdateCentroCustoDto,
  ): Promise<CentroCusto> {
    const centroCusto = await this.findOne(id);

    // Validar empresa (se mudou)
    if (updateCentroCustoDto.empresaId && 
        updateCentroCustoDto.empresaId !== centroCusto.empresaId) {
      const empresa = await this.empresaRepository.findOne({
        where: { id: updateCentroCustoDto.empresaId },
      });

      if (!empresa) {
        throw new NotFoundException(
          `Empresa com ID ${updateCentroCustoDto.empresaId} não encontrada`
        );
      }
    }

    await this.centroCustoRepository.update(id, updateCentroCustoDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const centroCusto = await this.findOne(id);
    
    // Soft delete (apenas marca como inativo)
    await this.centroCustoRepository.update(id, { ativo: false });
  }
}