import { PartialType } from '@nestjs/swagger';
import { CreateAlocacaoDto } from './create-alocacao.dto';
import { 
  IsOptional, 
  IsString, 
  Matches 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlocacaoDto extends PartialType(CreateAlocacaoDto) {
     @ApiProperty({
        example: '2025-12-31',
        description: 'Data de desalocação (formato: YYYY-MM-DD, opcional)',
        type: 'string',
        format: 'date',
        required: false,
      })
      @IsOptional()
      @IsString({ message: 'Data de desalocação deve ser uma string' })
      @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Data de desalocação deve estar no formato YYYY-MM-DD',
      })
      dataDesalocacao?: string;
}
