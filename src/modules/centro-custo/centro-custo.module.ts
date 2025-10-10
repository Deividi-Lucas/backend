import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentroCustoController } from './centro-custo.controller';
import { CentroCustoService } from './centro-custo.service';
import { CentroCusto } from './entities/centro-custo.entity';
import { Empresa } from '../empresa/entities/empresa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CentroCusto, Empresa]), // ✅ Importar ambas entities
  ],
  controllers: [CentroCustoController],
  providers: [CentroCustoService],
  exports: [CentroCustoService], // ✅ Exportar para usar em outros módulos
})
export class CentroCustoModule {}