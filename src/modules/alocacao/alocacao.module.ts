import { AlocacaoController } from "./alocacao.controller";
import { AlocacaoService } from "./alocacao.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlocacaoEntity } from "./entities/alocacao.entity";
import { CentroCusto } from "../centro-custo/entities/centro-custo.entity";
import { Ferramenta } from "../ferramenta/entities/ferramenta.entity";
import { Funcionario } from "../funcionario/entities/funcionario.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AlocacaoEntity,
    CentroCusto,
    Ferramenta,
    Funcionario
  ])],
  controllers: [AlocacaoController],
  providers: [AlocacaoService],
  exports: [AlocacaoService],
})
export class AlocacaoModule {}