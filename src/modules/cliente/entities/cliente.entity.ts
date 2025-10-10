import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('clientes')
export class Cliente {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'João da Silva', maxLength: 100 })
  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @ApiProperty({ example: '(11) 98765-4321', maxLength: 20 })
  @Column({ type: 'varchar', length: 20 })
  telefone: string;

  @ApiProperty({ example: 'joao.silva@example.com', maxLength: 100 })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @ApiPropertyOptional({ example: 'Vendas', maxLength: 50 })
  @Column({ type: 'varchar', length: 50, nullable: true })
  setor?: string;

  @ApiPropertyOptional({ example: 'Empresa XYZ', maxLength: 100 })
  @Column({ type: 'varchar', length: 100, nullable: true })
  empresa?: string;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  // Relacionamento (quando criar módulo Projeto)
  // @OneToMany(() => Projeto, (projeto) => projeto.cliente)
  // projetos: Projeto[];

  /**
   * Método de domínio - SRP
   */
  isAtivo(): boolean {
    return this.ativo;
  }
}