import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './modules/empresa/empresa.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // APENAS EM DESENVOLVIMENTO
      logging: true,
    }),
    EmpresaModule, // 👈 Adicione aqui
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
