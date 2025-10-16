import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ferramenta } from 'src/modules/ferramenta/entities/ferramenta.entity';

@Entity('manutencao')
export class Manutencao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    data_manutencao: string;

    @ManyToOne(() => Ferramenta, { nullable: false })
    @JoinColumn({ name: 'ferramenta_id' })
    ferramenta: Ferramenta;

    @Column({type:'date'})
    dataRetorno: string;

    @Column({ type: 'text' })
    descricao: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    custo: number;

    @Column({type:'date'})
    dataPrevisaoRetorno: string;
}