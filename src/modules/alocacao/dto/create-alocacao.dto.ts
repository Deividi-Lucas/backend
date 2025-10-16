import { 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsBoolean,
  MaxLength,
  Matches,
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
  @Type(() => Number)
  ferramentaId: number;

  @ApiProperty({
    example: 1,
    description: 'ID do centro de custo responsável',
  })
  @IsInt({ message: 'ID do centro de custo deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do centro de custo é obrigatório' })
  @Type(() => Number)
  centroCustoId: number;

  @ApiProperty({
    example: 1,
    description: 'ID do funcionário responsável',
  })
  @IsInt({ message: 'ID do funcionário deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do funcionário é obrigatório' })
  @Type(() => Number)
  funcionarioId: number;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Data de início da alocação (formato: YYYY-MM-DD)',
    type: 'string',
    format: 'date',
  })
  @IsString({ message: 'Data de início deve ser uma string' })
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data de início deve estar no formato YYYY-MM-DD',
  })
  dataInicio: string;


  @ApiProperty({
    example: '2025-06-30',
    description: 'Data prevista para término (formato: YYYY-MM-DD, opcional)',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Data prevista para término deve ser uma string' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data prevista para término deve estar no formato YYYY-MM-DD',
  })
  dataPrevisaoDesalocacao?: string;

  @ApiProperty({
    example: 'Alocação para projeto de migração de sistema',
    description: 'Observações sobre a alocação',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Observações devem ser texto' })
  @MaxLength(500, { message: 'Observações não podem ter mais de 500 caracteres' })
  observacoes?: string;

  @ApiProperty({
    example: true,
    description: 'Status da alocação (ativa/inativa)',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser verdadeiro ou falso' })
  @Type(() => Boolean)
  ativo?: boolean;
}
