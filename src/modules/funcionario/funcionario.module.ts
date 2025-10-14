import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncionarioService } from './funcionario.service';
import { FuncionarioController } from './funcionario.controller';
import { Funcionario } from './entities/funcionario.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Funcionario])],
    controllers: [FuncionarioController],
    providers: [FuncionarioService],
    exports: [FuncionarioService], 
})
export class FuncionarioModule {}