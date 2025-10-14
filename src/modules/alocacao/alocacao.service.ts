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
   */
  async create(createAlocacaoDto: CreateAlocacaoDto): Promise<AlocacaoEntity> {
    // Validar existência das entidades relacionadas em paralelo
    const [ferramenta, centroCusto, funcionario] = await Promise.all([
      this.ferramentaRepository.findOne({
        where: { id: createAlocacaoDto.ferramentaId, ativo: true },
      }),
      this.centroCustoRepository.findOne({
        where: { id: createAlocacaoDto.centroCustoId, ativo: true },
      }),
      this.funcionarioRepository.findOne({
        where: { id: createAlocacaoDto.funcionarioId, ativo: true },
      }),
    ]);

    if (!ferramenta) {
      throw new NotFoundException(
        `Ferramenta com ID ${createAlocacaoDto.ferramentaId} não encontrada ou inativa`,
      );
    }

    if (!centroCusto) {
      throw new NotFoundException(
        `Centro de Custo com ID ${createAlocacaoDto.centroCustoId} não encontrado ou inativo`,
      );
    }

    if (!funcionario) {
      throw new NotFoundException(
        `Funcionário com ID ${createAlocacaoDto.funcionarioId} não encontrado ou inativo`,
      );
    }

    // Validar datas
    this.validarDatas(
      createAlocacaoDto.dataInicio,
      createAlocacaoDto.dataDesalocacao,
      createAlocacaoDto.dataPrevisaoDesalocacao,
    );

    // Verificar sobreposição de período
    await this.verificarSobreposicaoPeriodo(
      createAlocacaoDto.ferramentaId,
      createAlocacaoDto.funcionarioId,
      createAlocacaoDto.dataInicio,
      createAlocacaoDto.dataDesalocacao,
    );

    // Criar e salvar alocação
    const alocacao = this.alocacaoRepository.create(createAlocacaoDto);

    return await this.alocacaoRepository.save(alocacao);
  }

  /**
   * 🔍 Lista todas as alocações ativas ou filtra
   */
  async findAll(filter?: FilterAlocacaoDto): Promise<AlocacaoEntity[]> {
    const where: any = {};

    if (filter) {
      if (filter.ferramentaId) where.ferramentaId = filter.ferramentaId;
      if (filter.centroCustoId) where.centroCustoId = filter.centroCustoId;
      if (filter.funcionarioId) where.funcionarioId = filter.funcionarioId;
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

  /**
   * 🔍 Busca uma alocação por ID
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
   * ✏️ Atualiza uma alocação
   */
  async update(
    id: number, 
    updateAlocacaoDto: UpdateAlocacaoDto,
  ): Promise<AlocacaoEntity> {
    const alocacao = await this.findOne(id);

    // Validar datas se alteradas
    if (
      updateAlocacaoDto.dataInicio || 
      updateAlocacaoDto.dataDesalocacao !== undefined ||
      updateAlocacaoDto.dataPrevisaoDesalocacao !== undefined
    ) {
      const dataInicio = updateAlocacaoDto.dataInicio || alocacao.dataInicio;
      const dataDesalocacao = updateAlocacaoDto.dataDesalocacao !== undefined 
        ? updateAlocacaoDto.dataDesalocacao 
        : alocacao.dataDesalocacao;
      const dataPrevisaoDesalocacao = updateAlocacaoDto.dataPrevisaoDesalocacao !== undefined
        ? updateAlocacaoDto.dataPrevisaoDesalocacao
        : alocacao.dataPrevisaoDesalocacao;

      this.validarDatas(dataInicio, dataDesalocacao, dataPrevisaoDesalocacao);
    }

    // Validar relações se fornecidas
    await this.validarRelacoes(updateAlocacaoDto);

    // Atualizar campos
    Object.assign(alocacao, updateAlocacaoDto);

    return await this.alocacaoRepository.save(alocacao);
  }

  /**
   * 🗑️ Remove uma alocação (soft delete)
   */
  async remove(id: number): Promise<void> {
    const alocacao = await this.findOne(id);
    alocacao.ativo = false;
    await this.alocacaoRepository.save(alocacao);
  }

  /**
   * 🔍 Busca alocações por funcionário
   */
  async findByFuncionario(funcionarioId: number): Promise<AlocacaoEntity[]> {
    return await this.alocacaoRepository.find({
      where: { funcionarioId, ativo: true },
      relations: ['ferramenta', 'centroCusto', 'funcionario'],
      order: { dataInicio: 'DESC' },
    });
  }

  /**
   * 🔍 Busca alocações por ferramenta
   */
  async findByFerramenta(ferramentaId: number): Promise<AlocacaoEntity[]> {
    return await this.alocacaoRepository.find({
      where: { ferramentaId, ativo: true },
      relations: ['ferramenta', 'centroCusto', 'funcionario'],
      order: { dataInicio: 'DESC' },
    });
  }

  /**
   * 🔍 Busca alocações por centro de custo
   */
  async findByCentroCusto(centroCustoId: number): Promise<AlocacaoEntity[]> {
    return await this.alocacaoRepository.find({
      where: { centroCustoId, ativo: true },
      relations: ['ferramenta', 'centroCusto', 'funcionario'],
      order: { dataInicio: 'DESC' },
    });
  }

  /**
   * 🔍 Busca alocações ativas em um período
   */
  async findByPeriodo(dataInicio: Date, dataFim: Date): Promise<AlocacaoEntity[]> {
    const query = this.alocacaoRepository
      .createQueryBuilder('alocacao')
      .leftJoinAndSelect('alocacao.ferramenta', 'ferramenta')
      .leftJoinAndSelect('alocacao.centroCusto', 'centroCusto')
      .leftJoinAndSelect('alocacao.funcionario', 'funcionario')
      .where('alocacao.ativo = :ativo', { ativo: true })
      .andWhere('alocacao.data_inicio <= :dataFim', { dataFim })
      .andWhere(
        '(alocacao.data_desalocacao IS NULL OR alocacao.data_desalocacao >= :dataInicio)', 
        { dataInicio },
      )
      .orderBy('alocacao.data_inicio', 'DESC');

    return await query.getMany();
  }

  /**
   * 🔒 Valida consistência de datas
   * @private
   */
  private validarDatas(
    dataInicio: Date,
    dataDesalocacao: Date | null,
    dataPrevisaoDesalocacao: Date | null,
  ): void {
    // Validar data de desalocação
    if (dataDesalocacao && dataDesalocacao < dataInicio) {
      throw new BadRequestException(
        'Data de desalocação não pode ser anterior à data de início',
      );
    }

    // Validar data de previsão
    if (dataPrevisaoDesalocacao && dataPrevisaoDesalocacao < dataInicio) {
      throw new BadRequestException(
        'Data prevista para término não pode ser anterior à data de início',
      );
    }

    // Se ambas existem, validar ordem
    if (dataDesalocacao && dataPrevisaoDesalocacao) {
      if (dataDesalocacao < dataPrevisaoDesalocacao) {
        throw new BadRequestException(
          'Data de desalocação não pode ser anterior à data prevista para término',
        );
      }
    }
  }

  /**
   * 🔒 Valida existência de entidades relacionadas
   * @private
   */
  private async validarRelacoes(dto: UpdateAlocacaoDto): Promise<void> {
    if (dto.ferramentaId) {
      const ferramenta = await this.ferramentaRepository.findOne({
        where: { id: dto.ferramentaId, ativo: true },
      });
      if (!ferramenta) {
        throw new NotFoundException(
          `Ferramenta com ID ${dto.ferramentaId} não encontrada ou inativa`,
        );
      }
    }

    if (dto.centroCustoId) {
      const centroCusto = await this.centroCustoRepository.findOne({
        where: { id: dto.centroCustoId, ativo: true },
      });
      if (!centroCusto) {
        throw new NotFoundException(
          `Centro de Custo com ID ${dto.centroCustoId} não encontrado ou inativo`,
        );
      }
    }

    if (dto.funcionarioId) {
      const funcionario = await this.funcionarioRepository.findOne({
        where: { id: dto.funcionarioId, ativo: true },
      });
      if (!funcionario) {
        throw new NotFoundException(
          `Funcionário com ID ${dto.funcionarioId} não encontrado ou inativo`,
        );
      }
    }
  }

  /**
   * 🔒 Verifica sobreposição de períodos
   * @private
   */
  private async verificarSobreposicaoPeriodo(
    ferramentaId: number,
    funcionarioId: number,
    dataInicio: Date,
    dataDesalocacao: Date | null,
    alocacaoIdIgnorar?: number,
  ): Promise<void> {
    const alocacoesExistentes = await this.alocacaoRepository.find({
      where: {
        ferramentaId,
        funcionarioId,
        ativo: true,
      },
    });

    for (const alocacaoExistente of alocacoesExistentes) {
      // Ignorar a própria alocação em caso de update
      if (alocacaoIdIgnorar && alocacaoExistente.id === alocacaoIdIgnorar) {
        continue;
      }

      const hasSobreposicao = this.calcularSobreposicaoPeriodo(
        dataInicio,
        dataDesalocacao,
        alocacaoExistente.dataInicio,
        alocacaoExistente.dataDesalocacao,
      );

      if (hasSobreposicao) {
        throw new ConflictException(
          `Já existe uma alocação ativa para esta ferramenta e funcionário no período informado (${alocacaoExistente.dataInicio.toISOString().split('T')[0]} - ${alocacaoExistente.dataDesalocacao ? alocacaoExistente.dataDesalocacao.toISOString().split('T')[0] : 'Em andamento'})`,
        );
      }
    }
  }

  /**
   * 🔒 Calcula se há sobreposição entre dois períodos
   * @private
   */
  private calcularSobreposicaoPeriodo(
    inicio1: Date,
    fim1: Date | null,
    inicio2: Date,
    fim2: Date | null,
  ): boolean {
    // Se não há data fim, considera período aberto (válido até hoje)
    const fimReal1 = fim1 || new Date('2099-12-31');
    const fimReal2 = fim2 || new Date('2099-12-31');

    // Verifica se há sobreposição
    return inicio1 <= fimReal2 && fimReal1 >= inicio2;
  }
}
