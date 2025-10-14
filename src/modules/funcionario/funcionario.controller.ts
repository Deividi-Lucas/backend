import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Controller('funcionarios')
export class FuncionarioController {
    constructor(private readonly funcionarioService: FuncionarioService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
        return this.funcionarioService.createFuncionario(createFuncionarioDto);
    }

    @Get()
    findAll() {
        return this.funcionarioService.findAllFuncionarios();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.funcionarioService.findOneFuncionario(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFuncionarioDto: UpdateFuncionarioDto) {
        return this.funcionarioService.updateFuncionario(+id, updateFuncionarioDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.funcionarioService.removeFuncionario(+id);
    }

    @Post(':id/ativar')
    activate(@Param('id') id: string) {
        return this.funcionarioService.activateFuncionario(+id);
    }

    @Post(':id/desativar')
    deactivate(@Param('id') id: string) {
        return this.funcionarioService.deactivateFuncionario(+id);
    }
}