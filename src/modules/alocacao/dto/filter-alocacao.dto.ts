import { IsInt, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterAlocacaoDto {
  @ApiProperty({
    example: 1,
    description: 'Filtrar por ID da ferramenta',
    required: false,
  })
  @IsInt({ message: 'ID da ferramenta deve ser um número inteiro' })
  @IsOptional()
  @Type(() => Number)
  ferramentaId?: number;

  @ApiProperty({
    example: 1,
    description: 'Filtrar por ID do centro de custo',
    required: false,
  })
  @IsInt({ message: 'ID do centro de custo deve ser um número inteiro' })
  @IsOptional()
  @Type(() => Number)
  centroCustoId?: number;

  @ApiProperty({
    example: 1,
    description: 'Filtrar por ID do funcionário',
    required: false,
  })
  @IsInt({ message: 'ID do funcionário deve ser um número inteiro' })
  @IsOptional()
  @Type(() => Number)
  funcionarioId?: number;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Filtrar alocações a partir desta data',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsDateString({}, { message: 'Data início deve ser uma data válida (YYYY-MM-DD)' })
  @IsOptional()
  @Type(() => Date)
  dataInicio?: Date;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Filtrar alocações até esta data',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsDateString({}, { message: 'Data fim deve ser uma data válida (YYYY-MM-DD)' })
  @IsOptional()
  @Type(() => Date)
  dataFim?: Date;

  @ApiProperty({
    example: true,
    description: 'Filtrar por status (ativo/inativo)',
    required: false,
  })
  @IsBoolean({ message: 'Ativo deve ser verdadeiro ou falso' })
  @IsOptional()
  @Type(() => Boolean)
  ativo?: boolean;
}