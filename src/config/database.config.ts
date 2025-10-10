import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * 🗄️ Configuração do TypeORM para PostgreSQL
 * 
 * Esta configuração será usada pelo TypeOrmModule.forRootAsync()
 * no app.module.ts
 */
export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  
  // Carregar todas as entities automaticamente
  autoLoadEntities: true,
  
  // ⚠️ APENAS EM DESENVOLVIMENTO - sincroniza schema automaticamente
  synchronize: process.env.NODE_ENV !== 'production',
  
  // Logs de queries SQL (útil para debug)
  logging: process.env.NODE_ENV === 'development',
  
  // Configurações de pool de conexões
  extra: {
    max: 10, // Máximo de conexões no pool
    min: 2,  // Mínimo de conexões no pool
  },
});
