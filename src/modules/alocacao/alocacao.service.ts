import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlocacaoEntity } from './entities/alocacao.entity';
import { CreateAlocacaoDto } from './dto/create-alocacao.dto';
import { UpdateAlocacaoDto } from './dto/update-alocacao.dto';
import { FilterAlocacaoDto } from './dto/filter-alocacao.dto';
import { CentroCusto } from '../centro-custo/entities/centro-custo.entity';
import { Ferramenta } from '../ferramenta/entities/ferramenta.entity';
import { Funcionario } from '../funcionario/entities/funcionario.entity';

@Injectable()
export class AlocacaoService {
  constructor(
    @InjectRepository(AlocacaoEntity)
    private readonly alocacaoRepository: Repository<AlocacaoEntity>,

    @InjectRepository(CentroCusto)
    private readonly centroCustoRepository: Repository<CentroCusto>,

    @InjectRepository(Ferramenta)
    private readonly ferramentaRepository: Repository<Ferramenta>,

    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,
  ) {}

  /**
   * 📝 Cria uma nova alocação
   * @param createAlocacaoDto Dados para criação da alocação
   * @returns Alocação criada
   */
  async create(createAlocacaoDto: CreateAlocacaoDto): Promise<AlocacaoEntity> {
    // Validar existência das entidades relacionadas
    await this.validarEntidadesRelacionadas(
      createAlocacaoDto.ferramentaId,
      createAlocacaoDto.centroCustoId,
      createAlocacaoDto.funcionarioId,
    );

    // Validar datas
    this.validarDatas(
      createAlocacaoDto.dataInicio,
      createAlocacaoDto.dataPrevisaoDesalocacao,
    );

    // Verificar sobreposição de período
    await this.verificarSobreposicaoPeriodo(
      createAlocacaoDto.ferramentaId,
      createAlocacaoDto.funcionarioId,
      createAlocacaoDto.dataInicio,
      createAlocacaoDto.dataPrevisaoDesalocacao,
    );

    // Mudar status de ferramenta para alocada
    const ferramenta = await this.ferramentaRepository.findOne({
      where: { id: createAlocacaoDto.ferramentaId },
    });

    if (!ferramenta) {
      throw new NotFoundException(`Ferramenta com ID ${createAlocacaoDto.ferramentaId} não encontrada`);
    }

    ferramenta.status = 'alocada';
    await this.ferramentaRepository.save(ferramenta);

    // Criar e salvar alocação
    const alocacao = this.alocacaoRepository.create(createAlocacaoDto);
    return await this.alocacaoRepository.save(alocacao);
  }

  /**
   * 🔍 Lista todas as alocações com filtros opcionais
   * @param filter Filtros de busca (opcional)
   * @returns Array de alocações
   */
  async findAll(filter?: FilterAlocacaoDto): Promise<AlocacaoEntity[]> {
    const where: any = {};

    if (filter) {
      if (filter.ativo !== undefined) where.ativo = filter.ativo;
    } else {
      where.ativo = true;
    }

    return await this.alocacaoRepository.find({
      where,
      relations: ['ferramenta', 'centroCusto', 'funcionario'],
      order: { dataInicio: 'DESC' },
    });
  }

  /*  */
  async desallocate(id: number): Promise<void> {
    const alocacao = await this.findOne(id);
    alocacao.dataDesalocacao = new Date().toISOString().split('T')[0];
    alocacao.ativo = false;
    await this.alocacaoRepository.save(alocacao);
  }

  /**
   * 🔍 Busca uma alocação por ID
   * @param id ID da alocação
   * @returns Alocação encontrada
   * @throws NotFoundException se não encontrar
   */
  async findOne(id: number): Promise<AlocacaoEntity> {
    const alocacao = await this.alocacaoRepository.findOne({
      where: { id },
      relations: ['ferramenta', 'centroCusto', 'funcionario'],
    });

    if (!alocacao) {
      throw new NotFoundException(`Alocação com ID ${id} não encontrada`);
    }

    return alocacao;
  }

  /**
   * ✏️ Atualiza uma alocação existente
   * @param id ID da alocação
   * @param updateAlocacaoDto Dados para atualização
   * @returns Alocação atualizada
   * @throws NotFoundException se não encontrar
   */
  async update(
    id: number, 
    updateAlocacaoDto: UpdateAlocacaoDto,
  ): Promise<AlocacaoEntity> {
    const alocacao = await this.findOne(id);

    // Validar datas se alguma for alterada
    if (
      updateAlocacaoDto.dataInicio || 
      updateAlocacaoDto.dataDesalocacao !== undefined ||
      updateAlocacaoDto.dataPrevisaoDesalocacao !== undefined
    ) {
      // Type-safe: garantir que valores são strings
      const dataInicio: string = updateAlocacaoDto.dataInicio ?? alocacao.dataInicio;
      const dataDesalocacao: string | null | undefined = 
        updateAlocacaoDto.dataDesalocacao !== undefined 
          ? updateAlocacaoDto.dataDesalocacao 
          : alocacao.dataDesalocacao;
      const dataPrevisaoDesalocacao: string | null | undefined = 
        updateAlocacaoDto.dataPrevisaoDesalocacao !== undefined
          ? updateAlocacaoDto.dataPrevisaoDesalocacao
          : alocacao.dataPrevisaoDesalocacao;

      this.validarDatas(dataInicio, dataPrevisaoDesalocacao);
    }

    // Validar entidades relacionadas se alguma ID for alterada
    if (
      updateAlocacaoDto.ferramentaId ||
      updateAlocacaoDto.centroCustoId ||
      updateAlocacaoDto.funcionarioId
    ) {
      await this.validarEntidadesRelacionadas(
        updateAlocacaoDto.ferramentaId ?? alocacao.ferramentaId,
        updateAlocacaoDto.centroCustoId ?? alocacao.centroCustoId,
        updateAlocacaoDto.funcionarioId ?? alocacao.funcionarioId,
      );
    }

    // Atualizar campos
    Object.assign(alocacao, updateAlocacaoDto);
    return await this.alocacaoRepository.save(alocacao);
  }

  /**
   * 🗑️ Remove uma alocação (soft delete)
   * @param id ID da alocação
   * @throws NotFoundException se não encontrar
   */
  async remove(id: number): Promise<void> {
    const alocacao = await this.findOne(id);

     
    const ferramenta = await this.ferramentaRepository.findOne({
      where: { id: id },
    });

    if (!ferramenta) {
      throw new NotFoundException(`Ferramenta com ID ${id} não encontrada`);
    }

    ferramenta.status = 'Disponivel';
    alocacao.ativo = false;
    await this.alocacaoRepository.save(alocacao);
  }

  /**
   * 🔍 Busca alocações de um funcionário específico
   * @param funcionarioId ID do funcionário
   * @returns Array de alocações do funcionário
   */
  async findByFuncionario(funcionarioId: number): Promise<AlocacaoEntity[]> {
    return await this.alocacaoRepository.find({
      where: { funcionarioId, ativo: true },
      relations: ['ferramenta', 'centroCusto', 'funcionario'],
      order: { dataInicio: 'DESC' },
    });
  }

  /**
   * 🔍 Busca alocações de uma ferramenta específica
   * @param ferramentaId ID da ferramenta
   * @returns Array de alocações da ferramenta
   */
  async findByFerramenta(ferramentaId: number): Promise<AlocacaoEntity[]> {
    return await this.alocacaoRepository.find({
      where: { ferramentaId, ativo: true },
      relations: ['ferramenta', 'centroCusto', 'funcionario'],
      order: { dataInicio: 'DESC' },
    });
  }

  /**
   * 🔍 Busca alocações de um centro de custo específico
   * @param centroCustoId ID do centro de custo
   * @returns Array de alocações do centro de custo
   */
  async findByCentroCusto(centroCustoId: number): Promise<AlocacaoEntity[]> {
    return await this.alocacaoRepository.find({
      where: { centroCustoId, ativo: true },
      relations: ['ferramenta', 'centroCusto', 'funcionario'],
      order: { dataInicio: 'DESC' },
    });
  }

  /**
   * 🔒 Valida existência e status ativo de entidades relacionadas
   * @private Método auxiliar interno seguindo SRP
   * @throws NotFoundException se alguma entidade não existir ou estiver inativa
   */
  private async validarEntidadesRelacionadas(
    ferramentaId: number,
    centroCustoId: number,
    funcionarioId: number,
  ): Promise<void> {
    const [ferramenta, centroCusto, funcionario] = await Promise.all([
      this.ferramentaRepository.findOne({
        where: { id: ferramentaId, ativo: true },
      }),
      this.centroCustoRepository.findOne({
        where: { id: centroCustoId, ativo: true },
      }),
      this.funcionarioRepository.findOne({
        where: { id: funcionarioId, ativo: true },
      }),
    ]);

    if (!ferramenta) {
      throw new NotFoundException(
        `Ferramenta com ID ${ferramentaId} não encontrada ou inativa`,
      );
    }

    if (!centroCusto) {
      throw new NotFoundException(
        `Centro de Custo com ID ${centroCustoId} não encontrado ou inativo`,
      );
    }

    if (!funcionario) {
      throw new NotFoundException(
        `Funcionário com ID ${funcionarioId} não encontrado ou inativo`,
      );
    }
  }

  /**
   * 🔒 Valida consistência e regras de negócio das datas
   * @private Método auxiliar interno seguindo SRP
   * @throws BadRequestException se datas forem inválidas ou inconsistentes
   */
  private validarDatas(
    dataInicio: string,
    dataPrevisaoDesalocacao: string | null | undefined,
  ): void {
    const inicio = new Date(dataInicio);

    // Validar se data de início é válida
    if (isNaN(inicio.getTime())) {
      throw new BadRequestException('Data de início inválida');
    }

    // Validar data de previsão
    if (dataPrevisaoDesalocacao) {
      const previsao = new Date(dataPrevisaoDesalocacao);
      
      if (isNaN(previsao.getTime())) {
        throw new BadRequestException('Data prevista para término inválida');
      }

      if (previsao < inicio) {
        throw new BadRequestException(
          'Data prevista para término não pode ser anterior à data de início',
        );
      }
    }
  }

  /**
   * 🔒 Verifica se há conflito de períodos de alocação
   * @private Método auxiliar interno seguindo SRP
   * @throws ConflictException se houver sobreposição de períodos
   */
  private async verificarSobreposicaoPeriodo(
    ferramentaId: number,
    funcionarioId: number,
    dataInicio: string,
    dataPrevisaoDesalocacao: string | null | undefined,
    alocacaoIdIgnorar?: number,
  ): Promise<void> {
    const alocacoesExistentes = await this.alocacaoRepository.find({
      where: {
        ferramentaId,
        funcionarioId,
        ativo: true,
      },
    });

    const inicio = new Date(dataInicio);
    const fim = dataPrevisaoDesalocacao ? new Date(dataPrevisaoDesalocacao) : null;

    for (const alocacaoExistente of alocacoesExistentes) {
      // Ignorar a própria alocação em caso de update
      if (alocacaoIdIgnorar && alocacaoExistente.id === alocacaoIdIgnorar) {
        continue;
      }

      const inicioExistente = new Date(alocacaoExistente.dataInicio);
      const fimExistente = alocacaoExistente.dataDesalocacao 
        ? new Date(alocacaoExistente.dataDesalocacao)
        : null;

      if (this.calcularSobreposicaoPeriodo(inicio, fim, inicioExistente, fimExistente)) {
        throw new ConflictException(
          `Já existe uma alocação ativa para esta ferramenta e funcionário no período informado`,
        );
      }
    }
  }

  /**
   * 🔒 Calcula se há sobreposição entre dois períodos
   * @private Método auxiliar interno seguindo SRP
   * @returns true se há sobreposição, false caso contrário
   */
  private calcularSobreposicaoPeriodo(
    inicio1: Date,
    fim1: Date | null,
    inicio2: Date,
    fim2: Date | null,
  ): boolean {
    // Se não há data fim, considera período em aberto
    const fimReal1 = fim1 || new Date('2099-12-31');
    const fimReal2 = fim2 || new Date('2099-12-31');

    // Verifica sobreposição: início1 <= fim2 E fim1 >= início2
    return inicio1 <= fimReal2 && fimReal1 >= inicio2;
  }
}
