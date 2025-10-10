import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  Length, 
  Min,
  IsInt,
  IsPositive
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCentroCustoDto {
  @ApiProperty({ 
    example: 'Financeiro', 
    description: 'Nome do centro de custo',
    minLength: 3,
    maxLength: 100
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 100, { message: 'Nome deve ter entre 3 e 100 caracteres' })
  nome: string;

  @ApiProperty({ 
    example: 1500.50, 
    description: 'Valor do centro de custo',
    minimum: 0
  })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor deve ser maior ou igual a 0' })
  valor: number;

  @ApiProperty({ 
    example: 'Gestão financeira', 
    description: 'Atividade do centro de custo',
    required: false
  })
  @IsString({ message: 'Atividade deve ser uma string' })
  @IsOptional()
  atividade?: string;

  @ApiProperty({ 
    example: 'Administrativa', 
    description: 'Tipo de unidade',
    required: false
  })
  @IsString({ message: 'Tipo de unidade deve ser uma string' })
  @IsOptional()
  tipo_de_unidade?: string;

  // ========================================
  // 🔗 RELACIONAMENTO COM EMPRESA
  // ========================================

  @ApiProperty({ 
    example: 1, 
    description: 'ID da empresa proprietária'
  })
  @IsInt({ message: 'ID da empresa deve ser um número inteiro' })
  @IsPositive({ message: 'ID da empresa deve ser positivo' })
  @IsNotEmpty({ message: 'ID da empresa é obrigatório' })
  empresaId: number;

  // // ========================================
  // // 🔗 HIERARQUIA (OPCIONAL)
  // // ========================================
  // EXCEÇÃO DE REGRA
  // @ApiProperty({ 
  //   example: 1, 
  //   description: 'ID do centro de custo pai (opcional)',
  //   required: false
  // })
  // @IsInt({ message: 'ID do centro de custo pai deve ser um número inteiro' })
  // @IsPositive({ message: 'ID do centro de custo pai deve ser positivo' })
  // @IsOptional()
  // centroCustoPaiId?: number;
}