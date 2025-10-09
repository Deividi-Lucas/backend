/**
 * Helper para testes de validação E2E
 * Segue SRP - Única responsabilidade: validar respostas de erro
 * 
 * @filepath test/helpers/validation-test.helper.ts
 */
export class ValidationTestHelper {
  /**
   * Verifica se a resposta contém erro de validação com palavra-chave
   * @param response - Resposta do supertest
   * @param keyword - Palavra-chave esperada nas mensagens
   * @param statusCode - Código HTTP esperado (padrão: 400)
   */
  static expectValidationError(
    response: any,
    keyword: string,
    statusCode = 400,
  ): void {
    expect(response.status).toBe(statusCode);
    
    expect(response.body).toMatchObject({
      statusCode,
      error: 'Bad Request',
      message: expect.any(Array),
    });

    const hasKeyword = response.body.message.some((msg: string) =>
      msg.toLowerCase().includes(keyword.toLowerCase()),
    );

    expect(hasKeyword).toBe(true);
  }

  /**
   * Verifica se a resposta contém múltiplas mensagens de validação
   * @param response - Resposta do supertest
   * @param keywords - Array de palavras-chave esperadas
   * @param statusCode - Código HTTP esperado (padrão: 400)
   */
  static expectValidationErrors(
    response: any,
    keywords: string[],
    statusCode = 400,
  ): void {
    expect(response.status).toBe(statusCode);
    
    expect(response.body).toMatchObject({
      statusCode,
      error: 'Bad Request',
      message: expect.any(Array),
    });

    keywords.forEach((keyword) => {
      const hasKeyword = response.body.message.some((msg: string) =>
        msg.toLowerCase().includes(keyword.toLowerCase()),
      );
      
      expect(hasKeyword).toBe(true);
    });
  }

  /**
   * Verifica estrutura exata da resposta de validação
   * @param response - Resposta do supertest
   * @param expectedMessages - Array de mensagens exatas esperadas
   * @param statusCode - Código HTTP esperado (padrão: 400)
   */
  static expectExactValidationMessages(
    response: any,
    expectedMessages: string[],
    statusCode = 400,
  ): void {
    expect(response.status).toBe(statusCode);
    
    expect(response.body).toMatchObject({
      statusCode,
      error: 'Bad Request',
      message: expect.arrayContaining(expectedMessages),
    });

    expect(response.body.message.length).toBe(expectedMessages.length);
  }

  /**
   * Verifica resposta de erro de negócio (não validação)
   * @param response - Resposta do supertest
   * @param keyword - Palavra-chave esperada na mensagem
   * @param statusCode - Código HTTP esperado
   */
  static expectBusinessError(
    response: any,
    keyword: string,
    statusCode: number,
  ): void {
    expect(response.status).toBe(statusCode);
    
    expect(response.body).toMatchObject({
      statusCode,
      message: expect.stringContaining(keyword),
    });
  }
}