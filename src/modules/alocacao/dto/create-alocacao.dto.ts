import { 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsDateString,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAlocacaoDto {
  @ApiProperty({
    example: 1,
    description: 'ID da ferramenta a ser alocada',
  })
  @IsInt({ message: 'ID da ferramenta deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID da ferramenta é obrigatório' })
  ferramentaId: number;

  @ApiProperty({
    example: 1,
    description: 'ID do centro de custo responsável',
  })
  @IsInt({ message: 'ID do centro de custo deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do centro de custo é obrigatório' })
  centroCustoId: number;

  @ApiProperty({
    example: 1,
    description: 'ID do funcionário responsável',
  })
  @IsInt({ message: 'ID do funcionário deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do funcionário é obrigatório' })
  funcionarioId: number;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Data de início da alocação (formato: YYYY-MM-DD)',
    type: 'string',
    format: 'date',
  })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @Type(() => Date)
  dataInicio: Date;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Data de desalocação/fim (formato: YYYY-MM-DD, opcional)',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsDateString({}, { message: 'Data de desalocação deve ser uma data válida (YYYY-MM-DD)' })
  @IsOptional()
  @Type(() => Date)
  dataDesalocacao?: Date | null;

  @ApiProperty({
    example: '2025-06-30',
    description: 'Data prevista para término da alocação (formato: YYYY-MM-DD, opcional)',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsDateString({}, { message: 'Data prevista para término deve ser uma data válida (YYYY-MM-DD)' })
  @IsOptional()
  @Type(() => Date)
  dataPrevisaoDesalocacao?: Date | null;

  @ApiProperty({
    example: 'Alocação para projeto de migração de sistema',
    description: 'Observações sobre a alocação',
    required: false,
    maxLength: 500,
  })
  @IsString({ message: 'Observações devem ser texto' })
  @MaxLength(500, { message: 'Observações não podem ter mais de 500 caracteres' })
  @IsOptional()
  observacoes?: string;

  @ApiProperty({
    example: true,
    description: 'Status da alocação (ativa/inativa)',
    default: true,
    required: false,
  })
  @IsBoolean({ message: 'Ativo deve ser verdadeiro ou falso' })
  @IsOptional()
  ativo?: boolean;
}
