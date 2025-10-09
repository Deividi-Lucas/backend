import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    ativo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;
}