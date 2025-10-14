import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CentroCusto } from '../../centro-custo/entities/centro-custo.entity';
import { Ferramenta } from '../../ferramenta/entities/ferramenta.entity';
import { Funcionario } from '../../funcionario/entities/funcionario.entity';

@Entity('alocacoes')
export class AlocacaoEntity {
  @ApiProperty({ example: 1, description: 'ID único da alocação' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID da ferramenta alocada' })
  @Column({ name: 'ferramenta_id' })
  ferramentaId: number;

  @ApiProperty({ type: () => Ferramenta, description: 'Ferramenta alocada' })
  @ManyToOne(() => Ferramenta, { eager: false })
  @JoinColumn({ name: 'ferramenta_id' })
  ferramenta: Ferramenta;

  @ApiProperty({ example: 1, description: 'ID do centro de custo' })
  @Column({ name: 'centro_custo_id' })
  centroCustoId: number;

  @ApiProperty({ type: () => CentroCusto, description: 'Centro de custo responsável' })
  @ManyToOne(() => CentroCusto, { eager: false })
  @JoinColumn({ name: 'centro_custo_id' })
  centroCusto: CentroCusto;

  @ApiProperty({ example: 1, description: 'ID do funcionário' })
  @Column({ name: 'funcionario_id' })
  funcionarioId: number;

  @ApiProperty({ type: () => Funcionario, description: 'Funcionário responsável' })
  @ManyToOne(() => Funcionario, { eager: false })
  @JoinColumn({ name: 'funcionario_id' })
  funcionario: Funcionario;

  @ApiProperty({ 
    example: '2025-01-01', 
    description: 'Data de início da alocação',
    type: 'string',
    format: 'date'
  })
  @Column({ type: 'date', name: 'data_inicio' })
  dataInicio: Date;

  @ApiProperty({ 
    example: '2025-12-31', 
    description: 'Data de fim da alocação (opcional)',
    type: 'string',
    format: 'date',
    required: false
  })
  @Column({ type: 'date', name: 'data_fim', nullable: true })
  dataDesalocacao: Date | null;

  @ApiProperty({
    example: '2025-06-30',
    description: 'Data prevista para término da alocação (opcional)',
    type: 'string',
    format: 'date',
    required: false
  })
  @Column({ type: 'date', name: 'data_previsao_fim', nullable: true })
  dataPrevisaoDesalocacao: Date | null;

  @ApiProperty({ 
    example: 'Alocação para projeto X', 
    description: 'Observações sobre a alocação',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  observacoes: string | null;

  @ApiProperty({ example: true, description: 'Status da alocação (ativa/inativa)' })
  @Column({ default: true })
  ativo: boolean;

  @ApiProperty({ example: '2025-01-15T10:30:00Z', description: 'Data de criação do registro' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T15:45:00Z', description: 'Data da última atualização' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}