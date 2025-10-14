import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('funcionarios')
export class Funcionario {
    @ApiProperty({ example: 1, description: 'ID único do funcionário' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'João Silva', description: 'Nome completo do funcionário' })
    @Column({ length: 100 })
    nome: string;

    @ApiProperty({ example: true, description: 'Status do funcionário (ativo/inativo)' })
    @Column({ default: true })
    ativo: boolean; 
}