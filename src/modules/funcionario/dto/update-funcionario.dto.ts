import { PartialType } from "@nestjs/swagger";
import { CreateFuncionarioDto } from "./create-funcionario.dto";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFuncionarioDto extends PartialType(CreateFuncionarioDto) {
    @ApiProperty({ example: 'João Silva', description: 'Nome completo do funcionário' })
    @IsString()
    @Length(3, 100)
    nome?: string;

    @ApiProperty({ example: true, description: 'Status do funcionário (ativo/inativo)' })
    @IsBoolean()
    ativo?: boolean;

}