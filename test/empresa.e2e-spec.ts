import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../src/modules/empresa/entities/empresa.entity';
import { ValidationTestHelper } from './helpers/validation-test.helper';
import { EmpresaTestFactory } from './factories/empresa.factory';

describe('EmpresaController (e2e)', () => {
  let app: INestApplication;
  let empresaRepository: Repository<Empresa>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.setGlobalPrefix('api/v1');
    await app.init();

    empresaRepository = moduleFixture.get<Repository<Empresa>>(
      getRepositoryToken(Empresa),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await empresaRepository.query('TRUNCATE TABLE empresas CASCADE');
  });

  // ========================================
  // 📝 TESTES DE CRIAÇÃO (POST)
  // ========================================

  describe('POST /api/v1/empresas', () => {
    it('deve criar uma nova empresa com sucesso', async () => {
      const createDto = {
        nome: 'Empresa Teste LTDA',
        cnpj: '12345678901234',
        endereco: 'Rua Teste, 123',
        telefone: '(11) 98765-4321',
        email: 'contato@empresateste.com',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        nome: createDto.nome,
        cnpj: createDto.cnpj,
        endereco: createDto.endereco,
        telefone: createDto.telefone,
        email: createDto.email,
        ativo: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('deve criar empresa apenas com campos obrigatórios', async () => {
      const createDto = {
        nome: 'Empresa Mínima',
        cnpj: '98765432109876',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        nome: createDto.nome,
        cnpj: createDto.cnpj,
        ativo: true,
      });
    });

    it('deve retornar 409 ao tentar criar empresa com CNPJ duplicado', async () => {
      const createDto = {
        nome: 'Empresa Teste',
        cnpj: '11111111111111',
      };

      await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send({ ...createDto, nome: 'Outra Empresa' })
        .expect(409);

      expect(response.body.message).toContain('CNPJ');
      expect(response.body.message).toContain('já está cadastrado');
    });

    it('deve retornar 400 quando nome não for enviado', async () => {
      const createDto = {
        cnpj: '12345678901234',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(400);

      // ✅ Usando helper
      ValidationTestHelper.expectValidationError(response, 'Nome');
    });

    it('deve retornar 400 quando CNPJ for inválido', async () => {
      const createDto = {
        nome: 'Empresa Teste',
        cnpj: '123', // CNPJ inválido
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(400);

      // ✅ Usando helper - verifica se existe mensagem sobre CNPJ
      ValidationTestHelper.expectValidationError(response, 'CNPJ');
    });

    it('deve retornar 400 quando CNPJ tiver apenas letras', async () => {
      const createDto = {
        nome: 'Empresa Teste',
        cnpj: 'abcdefghijklmn', // CNPJ com letras
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(400);

      // ✅ Verificar que contém mensagem sobre "apenas números"
      ValidationTestHelper.expectValidationErrors(response, [
        'CNPJ',
        'apenas números',
      ]);
    });

    it('deve retornar 400 quando email for inválido', async () => {
      const createDto = {
        nome: 'Empresa Teste',
        cnpj: '12345678901234',
        email: 'email-invalido',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(400);

      // ✅ Usando helper
      ValidationTestHelper.expectValidationError(response, 'Email');
    });

    it('deve retornar 400 quando telefone for inválido', async () => {
      const createDto = {
        nome: 'Empresa Teste',
        cnpj: '12345678901234',
        telefone: '123', // Telefone inválido
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(400);

      // ✅ Usando helper
      ValidationTestHelper.expectValidationError(response, 'Telefone');
    });

    it('deve retornar 400 com múltiplos erros de validação', async () => {
      const createDto = {
        // nome ausente
        cnpj: '123', // CNPJ inválido
        email: 'email-invalido', // Email inválido
        telefone: '123', // Telefone inválido
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(400);

      // ✅ Verificar múltiplos erros
      ValidationTestHelper.expectValidationErrors(response, [
        'Nome',
        'CNPJ',
        'Email',
        'Telefone',
      ]);
    });

    it('deve retornar 400 quando enviar campos extras', async () => {
      const createDto = {
        nome: 'Empresa Teste',
        cnpj: '12345678901234',
        campoExtra: 'não deveria existir',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/empresas')
        .send(createDto)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
      });
    });
  });

  // ========================================
  // 📖 TESTES DE LISTAGEM (GET)
  // ========================================

  describe('GET /api/v1/empresas', () => {
    beforeEach(async () => {
      await empresaRepository.save([
        {
          nome: 'Empresa A',
          cnpj: '11111111111111',
          ativo: true,
        },
        {
          nome: 'Empresa B',
          cnpj: '22222222222222',
          ativo: true,
        },
        {
          nome: 'Empresa C Inativa',
          cnpj: '33333333333333',
          ativo: false,
        },
      ]);
    });

    it('deve listar todas as empresas ativas', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/empresas')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].nome).toBe('Empresa A');
      expect(response.body[1].nome).toBe('Empresa B');
    });

    it('deve retornar array vazio quando não houver empresas', async () => {
      await empresaRepository.query('TRUNCATE TABLE empresas CASCADE');

      const response = await request(app.getHttpServer())
        .get('/api/v1/empresas')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  // ========================================
  // 🔍 TESTES DE BUSCA POR ID (GET)
  // ========================================

  describe('GET /api/v1/empresas/:id', () => {
    let empresaId: number;

    beforeEach(async () => {
      const empresa = await empresaRepository.save({
        nome: 'Empresa Teste',
        cnpj: '12345678901234',
        email: 'teste@empresa.com',
        ativo: true,
      });
      empresaId = empresa.id;
    });

    it('deve buscar empresa por ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/empresas/${empresaId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: empresaId,
        nome: 'Empresa Teste',
        cnpj: '12345678901234',
        email: 'teste@empresa.com',
        ativo: true,
      });
    });

    it('deve retornar 404 quando empresa não existir', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/empresas/99999')
        .expect(404);

      expect(response.body.message).toContain('não encontrada');
    });

    it('deve retornar 400 quando ID não for número', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/empresas/abc')
        .expect(400);
    });
  });

  // ========================================
  // 🔍 TESTES DE BUSCA POR CNPJ (GET)
  // ========================================

  describe('GET /api/v1/empresas/cnpj/:cnpj', () => {
    beforeEach(async () => {
      await empresaRepository.save({
        nome: 'Empresa CNPJ',
        cnpj: '11111111111111',
        ativo: true,
      });
    });

    it('deve buscar empresa por CNPJ', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/empresas/cnpj/11111111111111')
        .expect(200);

      expect(response.body).toMatchObject({
        nome: 'Empresa CNPJ',
        cnpj: '11111111111111',
      });
    });

    it('deve retornar 404 quando CNPJ não existir', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/empresas/cnpj/99999999999999')
        .expect(404);

      expect(response.body.message).toContain('não encontrada');
    });
  });

  // ========================================
  // 📊 TESTES DE ESTATÍSTICAS (GET)
  // ========================================

  describe('GET /api/v1/empresas/statistics', () => {
    beforeEach(async () => {
      await empresaRepository.save([
        { nome: 'Empresa 1', cnpj: '11111111111111', ativo: true },
        { nome: 'Empresa 2', cnpj: '22222222222222', ativo: true },
        { nome: 'Empresa 3', cnpj: '33333333333333', ativo: true },
        { nome: 'Empresa 4', cnpj: '44444444444444', ativo: false },
        { nome: 'Empresa 5', cnpj: '55555555555555', ativo: false },
      ]);
    });

    it('deve retornar estatísticas corretas', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/empresas/statistics')
        .expect(200);

      expect(response.body).toEqual({
        total: 5,
        ativas: 3,
        inativas: 2,
      });
    });
  });

  // ========================================
  // ✏️ TESTES DE ATUALIZAÇÃO (PATCH)
  // ========================================

  describe('PATCH /api/v1/empresas/:id', () => {
    let empresaId: number;

    beforeEach(async () => {
      const empresa = await empresaRepository.save({
        nome: 'Empresa Original',
        cnpj: '12345678901234',
        email: 'original@empresa.com',
        ativo: true,
      });
      empresaId = empresa.id;
    });

    it('deve atualizar empresa com sucesso', async () => {
      const updateDto = {
        nome: 'Empresa Atualizada',
        email: 'atualizado@empresa.com',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/empresas/${empresaId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: empresaId,
        nome: 'Empresa Atualizada',
        cnpj: '12345678901234', // Não mudou
        email: 'atualizado@empresa.com',
      });
    });

    it('deve atualizar apenas campos enviados', async () => {
      const updateDto = {
        telefone: '(11) 99999-9999',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/empresas/${empresaId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        nome: 'Empresa Original', // Não mudou
        telefone: '(11) 99999-9999',
      });
    });

    it('deve retornar 404 ao tentar atualizar empresa inexistente', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/v1/empresas/99999')
        .send({ nome: 'Teste' })
        .expect(404);

      expect(response.body.message).toContain('não encontrada');
    });

    it('deve retornar 409 ao tentar atualizar CNPJ para um já existente', async () => {
      // Criar outra empresa
      await empresaRepository.save({
        nome: 'Outra Empresa',
        cnpj: '99999999999999',
        ativo: true,
      });

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/empresas/${empresaId}`)
        .send({ cnpj: '99999999999999' })
        .expect(409);

      expect(response.body.message).toContain('CNPJ');
    });
  });

  // ========================================
  // 🔄 TESTES DE REATIVAÇÃO (PATCH)
  // ========================================

  describe('PATCH /api/v1/empresas/:id/reativar', () => {
    let empresaId: number;

    beforeEach(async () => {
      const empresa = await empresaRepository.save({
        nome: 'Empresa Inativa',
        cnpj: '12345678901234',
        ativo: false,
      });
      empresaId = empresa.id;
    });

    it('deve reativar empresa com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/empresas/${empresaId}/reativar`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: empresaId,
        ativo: true,
      });
    });

    it('deve retornar 404 ao tentar reativar empresa inexistente', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/empresas/99999/reativar')
        .expect(404);
    });
  });

  // ========================================
  // 🗑️ TESTES DE DELEÇÃO (DELETE)
  // ========================================

  describe('DELETE /api/v1/empresas/:id/', () => {
    let empresaId: number;

    beforeEach(async () => {
      const empresa = await empresaRepository.save({
        nome: 'Empresa para Deletar',
        cnpj: '12345678901234',
        ativo: true,
      });
      empresaId = empresa.id;
    });

    it('deve desativar empresa (soft delete)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/empresas/${empresaId}`)
        .expect(204);

      // Verificar se foi desativada
      const empresa = await empresaRepository.findOne({
        where: { id: empresaId },
      });
      expect(empresa.ativo).toBe(false);
    });

    it('deve retornar 404 ao tentar deletar empresa inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/empresas/99999')
        .expect(404);
    });
  });

  describe('DELETE /api/v1/empresas/:id/hard', () => {
    let empresaId: number;

    beforeEach(async () => {
      const empresa = await empresaRepository.save({
        nome: 'Empresa para Deletar',
        cnpj: '12345678901234',
        ativo: true,
      });
      empresaId = empresa.id;
    });

    it('deve deletar empresa permanentemente', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/empresas/${empresaId}/hard`)
        .expect(204);

      // Verificar se foi deletada
      const empresa = await empresaRepository.findOne({
        where: { id: empresaId },
      });
      expect(empresa).toBeNull();
    });

    it('deve retornar 404 ao tentar hard delete de empresa inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/empresas/99999/hard')
        .expect(404);
    });
  });

  describe('DELETE /api/v1/empresas', () => {
    let empresaIdSoft: number;
    let empresaIdHard: number;

    beforeEach(async () => {
      // ✅ Usando factory - CNPJs sempre únicos
      const empresaSoft = await empresaRepository.save(
        EmpresaTestFactory.criarEmpresaBasica({
          nome: 'Empresa para Soft Delete',
        }),
      );
      empresaIdSoft = empresaSoft.id;

      const empresaHard = await empresaRepository.save(
        EmpresaTestFactory.criarEmpresaBasica({
          nome: 'Empresa para Hard Delete',
        }),
      );
      empresaIdHard = empresaHard.id;
    });

    describe('DELETE /:id (Soft Delete)', () => {
      it('deve desativar empresa (soft delete)', async () => {
        await request(app.getHttpServer())
          .delete(`/api/v1/empresas/${empresaIdSoft}`)
          .expect(204);

        const empresa = await empresaRepository.findOne({
          where: { id: empresaIdSoft },
        });

        expect(empresa).toBeDefined();
        expect(empresa.ativo).toBe(false);
      });
    });

    describe('DELETE /:id/hard (Hard Delete)', () => {
      it('deve deletar empresa permanentemente', async () => {
        await request(app.getHttpServer())
          .delete(`/api/v1/empresas/${empresaIdHard}/hard`)
          .expect(204);

        const empresa = await empresaRepository.findOne({
          where: { id: empresaIdHard },
        });

        expect(empresa).toBeNull();
      });
    });
  });
});