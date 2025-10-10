import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiPropertyOptional({
    description: 'Status de atividade do cliente',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Ativo deve ser um valor booleano' })
  ativo?: boolean;
}