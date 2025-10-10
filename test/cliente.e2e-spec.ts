import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { Cliente } from '../src/modules/cliente/entities/cliente.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClienteController (e2e)', () => {
  let app: INestApplication;
  let clienteRepository: Repository<Cliente>;

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

    clienteRepository = moduleFixture.get<Repository<Cliente>>(
      getRepositoryToken(Cliente),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clienteRepository.query('TRUNCATE TABLE clientes CASCADE');
  });

  // ========================================
  // 📝 TESTES DE CRIAÇÃO (POST)
  // ========================================

  describe('POST /api/v1/clientes', () => {
    it('deve criar um novo cliente com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/clientes')
        .send({
          nome: 'João da Silva',
          telefone: '(11) 98765-4321',
          email: 'joao.silva@example.com',
          setor: 'Vendas',
          empresa: 'Empresa XYZ',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('João da Silva');
      expect(response.body.email).toBe('joao.silva@example.com');
      expect(response.body.ativo).toBe(true);
    });

    it('deve criar cliente apenas com campos obrigatórios', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/clientes')
        .send({
          nome: 'Maria Santos',
          telefone: '(21) 91234-5678',
          email: 'maria.santos@example.com',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.setor).toBeNull();
      expect(response.body.empresa).toBeNull();
    });

    it('deve retornar 409 ao tentar criar cliente com email duplicado', async () => {
      await clienteRepository.save({
        nome: 'Cliente Existente',
        telefone: '(11) 98765-4321',
        email: 'duplicado@example.com',
      });

      await request(app.getHttpServer())
        .post('/api/v1/clientes')
        .send({
          nome: 'Novo Cliente',
          telefone: '(11) 91234-5678',
          email: 'duplicado@example.com',
        })
        .expect(409);
    });

    it('deve retornar 400 quando nome não for enviado', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/clientes')
        .send({
          telefone: '(11) 98765-4321',
          email: 'teste@example.com',
        })
        .expect(400);
    });

    it('deve retornar 400 quando email for inválido', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/clientes')
        .send({
          nome: 'Teste',
          telefone: '(11) 98765-4321',
          email: 'email-invalido',
        })
        .expect(400);
    });

    it('deve retornar 400 quando telefone for inválido', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/clientes')
        .send({
          nome: 'Teste',
          telefone: '123',
          email: 'teste@example.com',
        })
        .expect(400);
    });
  });

  // ========================================
  // 📖 TESTES DE LISTAGEM (GET)
  // ========================================

  describe('GET /api/v1/clientes', () => {
    beforeEach(async () => {
      await clienteRepository.save([
        {
          nome: 'Cliente A',
          telefone: '(11) 91111-1111',
          email: 'a@example.com',
          ativo: true,
        },
        {
          nome: 'Cliente B',
          telefone: '(11) 92222-2222',
          email: 'b@example.com',
          ativo: false,
        },
        {
          nome: 'Cliente C',
          telefone: '(11) 93333-3333',
          email: 'c@example.com',
          ativo: true,
        },
      ]);
    });

    it('deve listar todos os clientes', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/clientes')
        .expect(200);

      expect(response.body).toHaveLength(3);
    });

    it('deve filtrar clientes por nome', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/clientes?nome=Cliente A')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe('Cliente A');
    });

    it('deve filtrar clientes ativos', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/clientes?ativo=true')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every((c) => c.ativo)).toBe(true);
    });
  });

  // ========================================
  // 🔍 TESTES DE BUSCA POR ID (GET)
  // ========================================

  describe('GET /api/v1/clientes/:id', () => {
    let clienteId: number;

    beforeEach(async () => {
      const cliente = await clienteRepository.save({
        nome: 'Cliente Teste',
        telefone: '(11) 98765-4321',
        email: 'teste@example.com',
      });
      clienteId = cliente.id;
    });

    it('deve buscar cliente por ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/clientes/${clienteId}`)
        .expect(200);

      expect(response.body.id).toBe(clienteId);
      expect(response.body.nome).toBe('Cliente Teste');
    });

    it('deve retornar 404 quando cliente não existir', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/clientes/99999')
        .expect(404);
    });
  });

  // ========================================
  // ✏️ TESTES DE ATUALIZAÇÃO (PATCH)
  // ========================================

  describe('PATCH /api/v1/clientes/:id', () => {
    let clienteId: number;

    beforeEach(async () => {
      const cliente = await clienteRepository.save({
        nome: 'Cliente Original',
        telefone: '(11) 98765-4321',
        email: 'original@example.com',
      });
      clienteId = cliente.id;
    });

    it('deve atualizar cliente com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/clientes/${clienteId}`)
        .send({
          nome: 'Cliente Atualizado',
          setor: 'TI',
        })
        .expect(200);

      expect(response.body.nome).toBe('Cliente Atualizado');
      expect(response.body.setor).toBe('TI');
      expect(response.body.email).toBe('original@example.com');
    });

    it('deve retornar 404 ao tentar atualizar cliente inexistente', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/clientes/99999')
        .send({ nome: 'Teste' })
        .expect(404);
    });

    it('deve retornar 409 ao tentar atualizar email para um já existente', async () => {
      await clienteRepository.save({
        nome: 'Outro Cliente',
        telefone: '(11) 91234-5678',
        email: 'outro@example.com',
      });

      await request(app.getHttpServer())
        .patch(`/api/v1/clientes/${clienteId}`)
        .send({ email: 'outro@example.com' })
        .expect(409);
    });
  });

  // ========================================
  // 🗑️ TESTES DE DELEÇÃO (DELETE)
  // ========================================

  describe('DELETE /api/v1/clientes/:id', () => {
    let clienteId: number;

    beforeEach(async () => {
      const cliente = await clienteRepository.save({
        nome: 'Cliente para Deletar',
        telefone: '(11) 98765-4321',
        email: 'deletar@example.com',
      });
      clienteId = cliente.id;
    });

    it('deve deletar cliente com sucesso', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/clientes/${clienteId}`)
        .expect(204);

      const cliente = await clienteRepository.findOne({
        where: { id: clienteId },
      });
      expect(cliente).toBeNull();
    });

    it('deve retornar 404 ao tentar deletar cliente inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/clientes/99999')
        .expect(404);
    });
  });
});