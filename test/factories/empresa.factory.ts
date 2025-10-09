/**
 * Factory para criar dados de teste
 * Segue SRP - Responsabilidade única: criar dados de teste
 * 
 * @filepath test/factories/empresa.factory.ts
 */
import { Empresa } from "src/modules/empresa/entities/empresa.entity";
export class EmpresaTestFactory {
  private static cnpjCounter = 10000000000000;

  /**
   * Gera CNPJ único para testes
   */
  static gerarCnpjUnico(): string {
    return String(this.cnpjCounter++).padStart(14, '0');
  }

  /**
   * Cria empresa básica para testes
   */
  static criarEmpresaBasica(overrides?: Partial<Empresa>): Partial<Empresa> {
    return {
      nome: 'Empresa Teste',
      cnpj: this.gerarCnpjUnico(),
      ativo: true,
      ...overrides,
    };
  }

  /**
   * Cria empresa completa para testes
   */
  static criarEmpresaCompleta(overrides?: Partial<Empresa>): Partial<Empresa> {
    return {
      nome: 'Empresa Teste LTDA',
      cnpj: this.gerarCnpjUnico(),
      endereco: 'Rua Teste, 123',
      telefone: '(11) 98765-4321',
      email: 'teste@empresa.com',
      ativo: true,
      ...overrides,
    };
  }

  /**
   * Cria empresa inativa para testes
   */
  static criarEmpresaInativa(overrides?: Partial<Empresa>): Partial<Empresa> {
    return {
      nome: 'Empresa Inativa',
      cnpj: this.gerarCnpjUnico(),
      ativo: false,
      ...overrides,
    };
  }
}