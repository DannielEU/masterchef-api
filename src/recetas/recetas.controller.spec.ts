import { Test, TestingModule } from '@nestjs/testing';
import { RecetasController } from './recetas.controller';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RecetasController', () => {
  let controller: RecetasController;
  let service: RecetasService;

  const mockRecetasService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecetasController],
      providers: [
        {
          provide: RecetasService,
          useValue: mockRecetasService,
        },
      ],
    }).compile();

    controller = module.get<RecetasController>(RecetasController);
    service = module.get<RecetasService>(RecetasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (Validar que se pueda registrar una receta)', () => {
    it('debería crear una receta exitosamente', async () => {
      const createRecetaDto: CreateRecetaDto = {
        nombre: 'Paella Valenciana',
        descripcion: 'Receta tradicional de paella valenciana',
        ingredientes: ['arroz', 'pollo', 'conejo', 'judías verdes'],
        pasos: ['Sofreír el pollo', 'Añadir arroz', 'Cocinar'],
        tiempoPreparacion: 60,
        temporadaId: '507f1f77bcf86cd799439011',
        creadoPorId: '507f1f77bcf86cd799439022',
      };

      const recetaCreada = {
        _id: '507f1f77bcf86cd799439033',
        ...createRecetaDto,
        fechaCreacion: new Date(),
      };

      mockRecetasService.create.mockResolvedValue(recetaCreada);

      const result = await controller.create(createRecetaDto);

      expect(result).toEqual(recetaCreada);
      expect(service.create).toHaveBeenCalledWith(createRecetaDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll (Validar que la búsqueda por ingrediente devuelva resultados correctos)', () => {
    it('debería devolver recetas filtradas por ingrediente', async () => {
      const ingrediente = 'pollo';
      const recetasEsperadas = [
        {
          _id: '507f1f77bcf86cd799439033',
          nombre: 'Paella Valenciana',
          descripcion: 'Receta tradicional',
          ingredientes: ['arroz', 'pollo', 'conejo'],
          pasos: ['Sofreír el pollo', 'Añadir arroz'],
          tiempoPreparacion: 60,
          temporadaId: '507f1f77bcf86cd799439011',
          creadoPorId: '507f1f77bcf86cd799439022',
        },
        {
          _id: '507f1f77bcf86cd799439034',
          nombre: 'Arroz con Pollo',
          descripcion: 'Arroz simple con pollo',
          ingredientes: ['arroz', 'pollo'],
          pasos: ['Cocinar pollo', 'Añadir arroz'],
          tiempoPreparacion: 40,
          temporadaId: '507f1f77bcf86cd799439011',
          creadoPorId: '507f1f77bcf86cd799439022',
        },
      ];

      mockRecetasService.findAll.mockResolvedValue(recetasEsperadas);

      const result = await controller.findAll(undefined, undefined, ingrediente, undefined);

      expect(result).toEqual(recetasEsperadas);
      expect(service.findAll).toHaveBeenCalledWith({
        creadoPorId: undefined,
        rol: undefined,
        ingrediente: 'pollo',
        temporadaId: undefined,
      });
      expect(result).toHaveLength(2);
      expect(result.every(r => r.ingredientes.includes('pollo'))).toBe(true);
    });

    it('debería devolver todas las recetas cuando no hay filtros', async () => {
      const todasLasRecetas = [
        {
          _id: '507f1f77bcf86cd799439033',
          nombre: 'Paella Valenciana',
          ingredientes: ['arroz', 'pollo'],
        },
        {
          _id: '507f1f77bcf86cd799439034',
          nombre: 'Gazpacho',
          ingredientes: ['tomate', 'pepino'],
        },
      ];

      mockRecetasService.findAll.mockResolvedValue(todasLasRecetas);

      const result = await controller.findAll();

      expect(result).toEqual(todasLasRecetas);
      expect(service.findAll).toHaveBeenCalledWith({
        creadoPorId: undefined,
        rol: undefined,
        ingrediente: undefined,
        temporadaId: undefined,
      });
    });
  });

  describe('findOne (Validar que se devuelva error si se consulta una receta inexistente)', () => {
    it('debería devolver una receta cuando existe', async () => {
      const recetaId = '507f1f77bcf86cd799439033';
      const recetaEncontrada = {
        _id: recetaId,
        nombre: 'Paella Valenciana',
        descripcion: 'Receta tradicional',
        ingredientes: ['arroz', 'pollo'],
        pasos: ['Sofreír', 'Cocinar'],
        tiempoPreparacion: 60,
        temporadaId: '507f1f77bcf86cd799439011',
        creadoPorId: '507f1f77bcf86cd799439022',
      };

      mockRecetasService.findOne.mockResolvedValue(recetaEncontrada);

      const result = await controller.findOne(recetaId);

      expect(result).toEqual(recetaEncontrada);
      expect(service.findOne).toHaveBeenCalledWith(recetaId);
    });

    it('debería lanzar error 404 cuando la receta no existe', async () => {
      const recetaIdInexistente = '507f1f77bcf86cd799439099';

      mockRecetasService.findOne.mockRejectedValue(
        new HttpException('Receta no encontrada', HttpStatus.NOT_FOUND)
      );

      await expect(controller.findOne(recetaIdInexistente)).rejects.toThrow(
        new HttpException('Receta no encontrada', HttpStatus.NOT_FOUND)
      );
      expect(service.findOne).toHaveBeenCalledWith(recetaIdInexistente);
    });

    it('debería lanzar error 400 cuando el ID es inválido', async () => {
      const idInvalido = 'id-invalido';

      mockRecetasService.findOne.mockRejectedValue(
        new HttpException('ID inválido', HttpStatus.BAD_REQUEST)
      );

      await expect(controller.findOne(idInvalido)).rejects.toThrow(
        new HttpException('ID inválido', HttpStatus.BAD_REQUEST)
      );
      expect(service.findOne).toHaveBeenCalledWith(idInvalido);
    });
  });
});
