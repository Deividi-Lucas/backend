import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ========================================
  // 🔧 CONFIGURAÇÕES GLOBAIS
  // ========================================

  // Habilitar CORS (se necessário para frontend)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Prefixo global para todas as rotas (opcional)
  app.setGlobalPrefix('api/');

  // Pipe de validação global para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não declaradas no DTO
      forbidNonWhitelisted: true, // Lança erro se enviar propriedades extras
      transform: true, // Transforma payloads em instâncias de DTO
      transformOptions: {
        enableImplicitConversion: true, // Converte tipos automaticamente
      },
    }),
  );

  // ========================================
  // 📚 CONFIGURAÇÃO DO SWAGGER
  // ========================================

  const config = new DocumentBuilder()
    .setTitle('Sistema de Rateio API')
    .setDescription(
      'API para gerenciamento de custos entre projetos, empresas, colaboradores e recursos',
    )
    .setVersion('1.0')
    // Adicione autenticação JWT quando implementar
    // .addBearerAuth()
    .addServer('http://localhost:3000', 'Desenvolvimento Local')
    .setContact(
      'Equipe L3A',
      'https://l3asistemas.com.br',
      'financeiro@l3asistemas.com.br',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configurar endpoint do Swagger
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantém token após refresh
      docExpansion: 'none', // Collapse todos os endpoints
      filter: true, // Habilita busca
      showRequestDuration: true, // Mostra tempo de resposta
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
    },
    customSiteTitle: 'Sistema Rateio - API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { font-size: 2.5em; }
    `,
  });

  // ========================================
  // 🚀 INICIAR SERVIDOR
  // ========================================

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    🚀 Aplicação rodando em: http://localhost:${port}
    📚 Swagger UI disponível em: http://localhost:${port}/api/docs
    📊 API endpoints: http://localhost:${port}/api/
  `);
}

bootstrap();
