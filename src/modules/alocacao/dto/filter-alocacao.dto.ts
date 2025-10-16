import { IsInt, IsOptional, IsDateString, IsBoolean, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterAlocacaoDto {
  @ApiProperty({
    example: '2025-01-01',
    description: 'Filtrar alocações a partir desta data',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsString({ message: 'Data início deve ser uma string' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data início deve estar no formato YYYY-MM-DD',
  })
  dataInicio?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Filtrar alocações até esta data',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsString({ message: 'Data fim deve ser uma string' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data fim deve estar no formato YYYY-MM-DD',
  })
  dataFim?: string;

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