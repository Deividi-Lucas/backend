import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João da Silva',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 100, { message: 'Nome deve ter entre 3 e 100 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'Telefone do cliente',
    example: '(11) 98765-4321',
  })
  @IsString({ message: 'Telefone deve ser uma string' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX',
  })
  telefone: string;

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao.silva@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiPropertyOptional({
    description: 'Setor do cliente',
    example: 'Vendas',
    maxLength: 50,
  })
  @IsString({ message: 'Setor deve ser uma string' })
  @IsOptional()
  @Length(1, 50, { message: 'Setor deve ter no máximo 50 caracteres' })
  setor?: string;

  @ApiPropertyOptional({
    description: 'Empresa do cliente',
    example: 'Empresa XYZ',
    maxLength: 100,
  })
  @IsString({ message: 'Empresa deve ser uma string' })
  @IsOptional()
  @Length(1, 100, { message: 'Empresa deve ter no máximo 100 caracteres' })
  empresa?: string;

  @ApiProperty({
    description: 'Status de atividade do cliente',
    example: true,
  })
  @IsOptional()
  ativo: boolean = true;
}