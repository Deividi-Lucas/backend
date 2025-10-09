import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('empresas')
export class Empresa {
  @ApiProperty({ example: 1, description: 'ID único da empresa' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Empresa Exemplo LTDA', description: 'Nome da empresa' })
  @Column({ length: 100 })
  nome: string;

  @ApiProperty({ example: '12345678901234', description: 'CNPJ da empresa' })
  @Column({ length: 18, unique: true })
  cnpj: string;

  @ApiProperty({ example: 'Rua Exemplo, 123', description: 'Endereço da empresa', required: false })
  @Column({ length: 200, nullable: true })
  endereco: string;

  @ApiProperty({ example: '(11) 98765-4321', description: 'Telefone da empresa', required: false })
  @Column({ length: 20, nullable: true })
  telefone: string;

  @ApiProperty({ example: 'contato@empresa.com', description: 'Email da empresa', required: false })
  @Column({ length: 100, nullable: true })
  email: string;

  @ApiProperty({ example: true, description: 'Status ativo/inativo da empresa' })
  @Column({ default: true })
  ativo: boolean;

  @ApiProperty({ example: '2025-10-08T10:00:00Z', description: 'Data de criação' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-08T10:00:00Z', description: 'Data de atualização' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}