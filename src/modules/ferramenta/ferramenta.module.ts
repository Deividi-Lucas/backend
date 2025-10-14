import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FerramentaService } from './ferramenta.service';
import { FerramentaController } from './ferramenta.controller';
import { Ferramenta } from './entities/ferramenta.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Ferramenta])],
    controllers: [FerramentaController],
    providers: [FerramentaService],
    exports: [FerramentaService], 
})
export class FerramentaModule {}