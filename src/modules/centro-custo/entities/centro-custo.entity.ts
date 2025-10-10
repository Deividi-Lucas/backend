import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Empresa } from '../../empresa/entities/empresa.entity';

@Entity('centros_custo')
export class CentroCusto {
  @ApiProperty({ example: 1, description: 'ID único do centro de custo' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Financeiro', description: 'Nome do centro de custo' })
  @Column({ length: 100 })
  nome: string;

  @ApiProperty({ example: 1500.5, description: 'Valor do centro de custo' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @ApiProperty({
    example: 'Gestão financeira',
    description: 'Atividade do centro de custo',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  atividade: string;

  @ApiProperty({
    example: 'Administrativa',
    description: 'Tipo de unidade',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  tipo_de_unidade: string;

  // ========================================
  // 🔗 RELACIONAMENTO COM EMPRESA
  // ========================================

  @ApiProperty({
    type: () => Empresa,
    description: 'Empresa à qual o centro de custo pertence',
  })
  @ManyToOne(() => Empresa, (empresa) => empresa.centrosCusto, {
    nullable: false,
    onDelete: 'CASCADE', // Se empresa for deletada, deleta centros de custo
    eager: false, // Não carrega automaticamente (otimização)
  })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @ApiProperty({ example: 1, description: 'ID da empresa proprietária' })
  @Column({ name: 'empresa_id' })
  empresaId: number;

  // // ========================================
  // // 🔗 RELACIONAMENTO HIERÁRQUICO (Centro de Custo Pai)
  // // ========================================
  // EXCEÇÃO DE REGRA 

  // @ApiProperty({
  //   type: () => CentroCusto,
  //   description: 'Centro de custo pai (para hierarquia)',
  //   required: false,
  // })
  // @ManyToOne(() => CentroCusto, { nullable: true })
  // @JoinColumn({ name: 'centro_custo_pai_id' })
  // centroCustoPai: CentroCusto;

  // @ApiProperty({
  //   example: 1,
  //   description: 'ID do centro de custo pai',
  //   required: false,
  // })
  // @Column({ name: 'centro_custo_pai_id', nullable: true })
  // centroCustoPaiId: number;

  // ========================================
  // 🕒 TIMESTAMPS
  // ========================================

  @ApiProperty({
    example: '2025-10-10T10:00:00Z',
    description: 'Data de criação',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-10T10:00:00Z',
    description: 'Data de atualização',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ example: true, description: 'Status ativo/inativo' })
  @Column({ default: true })
  ativo: boolean;
}