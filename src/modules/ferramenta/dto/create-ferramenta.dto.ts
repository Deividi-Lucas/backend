import { ApiProperty } from "@nestjs/swagger";
import { 
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
    Min
} from "class-validator";

export class CreateFerramentaDto {
    @ApiProperty({ example: 'Martelo', description: 'Nome da ferramenta' })
    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    nome: string;

    @ApiProperty({ example: 'Bosch', description: 'Marca da ferramenta' })
    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    marca: string;

    @ApiProperty({ example: 'Ferramentas Manuais', description: 'Categoria da ferramenta' })
    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    categoria: string;

    @ApiProperty({ example: 99.99, description: 'Valor da ferramenta' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    valor: number;

    @ApiProperty({ example: 'Um martelo de alta qualidade', description: 'Descrição da ferramenta' })
    @IsNotEmpty()
    @IsString()
    @Length(10, 500)
    descricao: string;

    @ApiProperty({ example: true, description: 'Status da ferramenta (disponível/indisponível)' })
    @IsNotEmpty()
    @IsBoolean()
    ativo: boolean;
}
