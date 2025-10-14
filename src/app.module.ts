import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { getDatabaseConfig } from './config/database.config';
import { CentroCustoModule } from './modules/centro-custo/centro-custo.module';
import { FuncionarioModule } from './modules/funcionario/funcionario.module';
import { FerramentaModule } from './modules/ferramenta/ferramenta.module';
import { AlocacaoModule } from './modules/alocacao/alocacao.module';

@Module({
  imports: [
    // Configuração global de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuração do TypeORM usando arquivo de config
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    
    // Módulos de features
    EmpresaModule, 
    ClienteModule,
    CentroCustoModule,
    FuncionarioModule,
    FerramentaModule,
    AlocacaoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
