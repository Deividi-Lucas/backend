import { FerramentaService } from "./ferramenta.service";
import { CreateFerramentaDto } from "./dto/create-ferramenta.dto";
import { UpdateFerramentaDto } from "./dto/update-ferramenta.dto";
import { 
    Controller, 
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Ferramenta')
@Controller('ferramentas')
export class FerramentaController {
    constructor(private readonly ferramentaService: FerramentaService) {}

    @Post()
    async create(@Body() createFerramentaDto: CreateFerramentaDto) {
        return this.ferramentaService.createFerramenta(createFerramentaDto);
    }

    @Get()
    async findAll() {
        return this.ferramentaService.findAllFerramentas();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.ferramentaService.findOneFerramenta(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateFerramentaDto: UpdateFerramentaDto) {
        return this.ferramentaService.updateFerramenta(id, updateFerramentaDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.ferramentaService.deleteFerramenta(id);
    }
}