import { Funcionario } from "./entities/funcionario.entity";
import { CreateFuncionarioDto } from "./dto/create-funcionario.dto";
import { UpdateFuncionarioDto } from "./dto/update-funcionario.dto";
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FuncionarioService {
    constructor(
        @InjectRepository(Funcionario)
        private readonly funcionarioRepository: Repository<Funcionario>,
    ) {}

    /**
     * Criar novo funcionário
     */
    async createFuncionario(createFuncionarioDto: CreateFuncionarioDto): Promise<Funcionario> {
        const funcionario = this.funcionarioRepository.create(createFuncionarioDto);
        return this.funcionarioRepository.save(funcionario);
    }
    
    /**
     * Atualizar funcionário
     */
    async updateFuncionario(id: number, updateFuncionarioDto: UpdateFuncionarioDto): Promise<Funcionario> {
        const funcionario = await this.funcionarioRepository.findOne({ where: { id } });
        if (!funcionario) {
            throw new NotFoundException('Funcionário não encontrado');
        }
        Object.assign(funcionario, updateFuncionarioDto);
        return this.funcionarioRepository.save(funcionario);
    }


    /**
     * Listar todos os funcionários
     */
    async findAllFuncionarios(): Promise<Funcionario[]> {
        return this.funcionarioRepository.find();
    }
    /**
     *  Buscar funcionário por ID
     */
    async findOneFuncionario(id: number): Promise<Funcionario> {
        const funcionario = await this.funcionarioRepository.findOne({ where: { id } });
        if (!funcionario) {
            throw new NotFoundException('Funcionário não encontrado');
        }
        return funcionario;
    }

    /**
     * Deletar funcionário
     */
    async removeFuncionario(id: number): Promise<void> {
        const funcionario = await this.funcionarioRepository.findOne({ where: { id } });
        if (!funcionario) {
            throw new NotFoundException('Funcionário não encontrado');
        }
        await this.funcionarioRepository.remove(funcionario);
    }

    /**
     * Ativar funcionário
     */
    async activateFuncionario(id: number): Promise<Funcionario> {
        const funcionario = await this.funcionarioRepository.findOne({ where: { id } });
        if (!funcionario) {
            throw new NotFoundException('Funcionário não encontrado');
        }
        funcionario.ativo = true;
        return this.funcionarioRepository.save(funcionario);
    }

    /**
     * Desativar funcionário
     * */
    async deactivateFuncionario(id: number): Promise<Funcionario> {
        const funcionario = await this.funcionarioRepository.findOne({ where: { id } });
        if (!funcionario) {
            throw new NotFoundException('Funcionário não encontrado');
        }
        funcionario.ativo = false;
        return this.funcionarioRepository.save(funcionario);
    }
}