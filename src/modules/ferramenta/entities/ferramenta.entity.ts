import { ApiProperty } from "@nestjs/swagger";
import { Entity,PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('ferramentas')
export class Ferramenta {
    @ApiProperty({ example: 1, description: 'ID único da ferramenta' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Martelo', description: 'Nome da ferramenta' })
    @Column()
    nome: string;

    @ApiProperty({ example: true, description: 'Status da ferramenta (disponível/indisponível)' })
    @Column()
    ativo: boolean;

    /* marca */
    @ApiProperty({ example: 'Bosch', description: 'Marca da ferramenta' })
    @Column()
    marca: string;

    /* categoria */
    @ApiProperty({ example: 'Ferramentas Manuais', description: 'Categoria da ferramenta' })
    @Column()
    categoria: string;

    /* valor */
    @ApiProperty({ example: 99.99, description: 'Valor da ferramenta' })
    @Column('decimal', { precision: 10, scale: 2 })
    valor: number;
    
    @ApiProperty({ example: 'disponivel', description: 'Estado da ferramenta' })
    @Column()
    status: string;
    
    
    /* descricao */
    @ApiProperty({ example: 'Um martelo de alta qualidade', description: 'Descrição da ferramenta' })
    @Column()
    descricao: string;

    @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Data de criação do registro' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2023-10-01T12:00:00Z', description: 'Data de atualização do registro' })
    @CreateDateColumn()
    updatedAt: Date;

    
}
