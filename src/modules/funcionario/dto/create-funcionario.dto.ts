import { ApiProperty } from '@nestjs/swagger';
import { 
    IsBoolean,
    IsNotEmpty, 
    IsString, 
    Length
} from 'class-validator';



export class CreateFuncionarioDto {
    @ApiProperty({ example: 'João Silva', description: 'Nome completo do funcionário' })
    @IsNotEmpty()
    @IsString()
    @Length(3, 100)
    nome: string;

    @ApiProperty({ example: true, description: 'Status do funcionário (ativo/inativo)' })
    @IsNotEmpty()
    @IsBoolean()
    ativo: boolean;
}
