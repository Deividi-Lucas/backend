import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresaDto } from './create-empresa.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEmpresaDto extends PartialType(CreateEmpresaDto) {
  @IsBoolean({ message: 'Ativo deve ser um valor booleano' })
  @IsOptional()
  ativo?: boolean;
}