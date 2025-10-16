import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { FuncionarioModule } from '../src/modules/funcionario/funcionario.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Funcionario } from '../src/modules/funcionario/entities/funcionario.entity';
import { Repository } from 'typeorm';

describe('FuncionarioController (e2e)', () => {
  let app: INestApplication;
  let funcionarioRepository: Repository<Funcionario>;

  const mockFuncionario = {
    id: 1,
    nome: 'João Silva',
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockFuncionario),
    save: jest.fn().mockResolvedValue(mockFuncionario),
    find: jest.fn().mockResolvedValue([mockFuncionario]),
    findOne: jest.fn().mockResolvedValue(mockFuncionario),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FuncionarioModule],
    })
      .overrideProvider(getRepositoryToken(Funcionario))
      .useValue(mockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    funcionarioRepository = moduleFixture.get<Repository<Funcionario>>(
      getRepositoryToken(Funcionario),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('/funcionarios (POST)', () => {
    it('should create a new funcionario', () => {
      return request(app.getHttpServer())
        .post('/funcionarios')
        .send({
          nome: 'João Silva',
          ativo: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.nome).toBe('João Silva');
          expect(res.body.ativo).toBe(true);
        });
    });

    it('should return 400 when validation fails', () => {
      return request(app.getHttpServer())
        .post('/funcionarios')
        .send({
          nome: '',
          ativo: true,
        })
        .expect(400);
    });

    it('should return 400 when ativo is not boolean', () => {
      return request(app.getHttpServer())
        .post('/funcionarios')
        .send({
          nome: 'João Silva',
          ativo: 'invalid',
        })
        .expect(400);
    });
  });

  describe('/funcionarios (GET)', () => {
    it('should return an array of funcionarios', () => {
      return request(app.getHttpServer())
        .get('/funcionarios')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('nome');
          expect(res.body[0]).toHaveProperty('ativo');
        });
    });
  });

  describe('/funcionarios/:id (GET)', () => {
    it('should return a single funcionario', () => {
      return request(app.getHttpServer())
        .get('/funcionarios/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
          expect(res.body).toHaveProperty('nome');
          expect(res.body).toHaveProperty('ativo');
        });
    });

    it('should return 404 when funcionario not found', () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      return request(app.getHttpServer())
        .get('/funcionarios/999')
        .expect(404);
    });
  });

  describe('/funcionarios/:id (PATCH)', () => {
    it('should update a funcionario', () => {
      return request(app.getHttpServer())
        .patch('/funcionarios/1')
        .send({
          nome: 'João Silva Atualizado',
          ativo: false,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
        });
    });

    it('should update only nome', () => {
      return request(app.getHttpServer())
        .patch('/funcionarios/1')
        .send({
          nome: 'Maria Santos',
        })
        .expect(200);
    });

    it('should update only ativo status', () => {
      return request(app.getHttpServer())
        .patch('/funcionarios/1')
        .send({
          ativo: false,
        })
        .expect(200);
    });

    it('should return 404 when updating non-existent funcionario', () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      return request(app.getHttpServer())
        .patch('/funcionarios/999')
        .send({ nome: 'Test' })
        .expect(404);
    });
  });

  describe('/funcionarios/:id (DELETE)', () => {
    it('should delete a funcionario', () => {
      return request(app.getHttpServer())
        .delete('/funcionarios/1')
        .expect(200);
    });

    it('should return 404 when deleting non-existent funcionario', () => {
      mockRepository.delete.mockResolvedValueOnce({ affected: 0 });
      return request(app.getHttpServer())
        .delete('/funcionarios/999')
        .expect(404);
    });
  });
});