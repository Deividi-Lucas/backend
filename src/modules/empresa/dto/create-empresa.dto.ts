import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpresaDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa Exemplo LTDA',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 100, { message: 'Nome deve ter entre 3 e 100 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'CNPJ da empresa (apenas números)',
    example: '12345678901234',
    minLength: 14,
    maxLength: 14,
  })
  @IsString()
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Length(14, 14, { message: 'CNPJ deve ter 14 dígitos (apenas números)' })
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter apenas números' })
  cnpj: string;

  @ApiProperty({
    description: 'Endereço da empresa',
    example: 'Rua Exemplo, 123 - Centro',
    required: false,
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @Length(0, 200, { message: 'Endereço deve ter no máximo 200 caracteres' })
  endereco?: string;

  @ApiProperty({
    description: 'Telefone da empresa',
    example: '(11) 98765-4321',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, {
    message: 'Telefone inválido. Use formato: (11) 98765-4321',
  })
  telefone?: string;

  @ApiProperty({
    description: 'Email da empresa',
    example: 'contato@empresa.com',
    required: false,
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;
}