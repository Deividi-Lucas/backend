import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAlocacaoDto } from './create-alocacao.dto';
import { IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para atualização de alocação
 * Todos os campos são opcionais (herda de PartialType)
 */
export class UpdateAlocacaoDto extends PartialType(CreateAlocacaoDto) {

    @ApiProperty({
        example: '2025-01-15',
        description: 'Data de início da alocação (opcional)',
        type: 'string',
        format: 'date',
        required: false
    })
    @IsDateString({}, { message: 'Data de início deve ser uma data válida (YYYY-MM-DD)' })
    @IsOptional()
    @Type(() => Date)
    dataInicio?: Date | null;

    @ApiProperty({
        example: '2025-06-30',
        description: 'Data de desalocação (opcional)',
        type: 'string',
        format: 'date',
        required: false
    })
    @IsDateString({}, { message: 'Data de desalocação deve ser uma data válida (YYYY-MM-DD)' })
    @IsOptional()
    @Type(() => Date)
    dataDesalocacao?: Date | null;

}
