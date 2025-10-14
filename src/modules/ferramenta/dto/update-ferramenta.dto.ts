import { CreateFerramentaDto } from "./create-ferramenta.dto";
import { PartialType } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFerramentaDto extends PartialType(CreateFerramentaDto) {
    @ApiProperty({ example: 'Martelo', description: 'Nome da ferramenta' })
    @IsString()
    @Length(2, 100)
    nome?: string;

    @ApiProperty({ example: 'Bosch', description: 'Marca da ferramenta' })
    @IsString()
    @Length(2, 100)
    marca?: string;

    @ApiProperty({ example: 'Ferramentas Manuais', description: 'Categoria da ferramenta' })
    @IsString()
    @Length(2, 100)
    categoria?: string;

    @ApiProperty({ example: 99.99, description: 'Valor da ferramenta' })
    @IsNumber()
    @Min(0)
    valor?: number;

    @ApiProperty({ example: 'Um martelo de alta qualidade', description: 'Descrição da ferramenta' })
    @IsString()
    @Length(10, 500)
    descricao?: string;
    
    @ApiProperty({ example: true, description: 'Status da ferramenta (disponível/indisponível)' })
    @IsBoolean()
    ativo?: boolean;
}