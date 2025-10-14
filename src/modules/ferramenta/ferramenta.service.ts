import { Ferramenta } from "./entities/ferramenta.entity";
import { CreateFerramentaDto } from "./dto/create-ferramenta.dto";
import { UpdateFerramentaDto } from "./dto/update-ferramenta.dto";
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FerramentaService {
    constructor(
        @InjectRepository(Ferramenta)
        private readonly ferramentaRepository: Repository<Ferramenta>,
    ) {}
    /**
     * Criar nova ferramenta
     * */
    async createFerramenta(createFerramentaDto: CreateFerramentaDto): Promise<Ferramenta> {
        const ferramenta = this.ferramentaRepository.create(createFerramentaDto);
        return this.ferramentaRepository.save(ferramenta);
    }
    /**
     *  Atualizar ferramenta
     * */

    async updateFerramenta(id: number, updateFerramentaDto: UpdateFerramentaDto): Promise<Ferramenta> {
        const ferramenta = await this.ferramentaRepository.findOne({ where: { id } });
        if (!ferramenta) {
            throw new NotFoundException('Ferramenta não encontrada');
        }
        Object.assign(ferramenta, updateFerramentaDto);
        return this.ferramentaRepository.save(ferramenta);
    }

    /**
     * Listar todas as ferramentas
     * */
    async findAllFerramentas(): Promise<Ferramenta[]> {
        return this.ferramentaRepository.find();
    }

    /**
     * Buscar ferramenta por ID
     * */  
    async findOneFerramenta(id: number): Promise<Ferramenta> {
        const ferramenta = await this.ferramentaRepository.findOne({ where: { id } });
        if (!ferramenta) {
            throw new NotFoundException('Ferramenta não encontrada');
        }
        return ferramenta;
    }

    /**
     * Deletar ferramenta
     * */
    async deleteFerramenta(id: number): Promise<void> {
        const ferramenta = await this.ferramentaRepository.findOne({ where: { id } });
        if (!ferramenta) {
            throw new NotFoundException('Ferramenta não encontrada');
        }
        await this.ferramentaRepository.remove(ferramenta);
    }  
}