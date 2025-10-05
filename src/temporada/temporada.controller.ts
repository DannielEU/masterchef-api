import { Controller, Get, Post, Body, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TemporadaService } from './temporada.service';
import { CreateTemporadaDto } from './dto/create-temporada.dto';

@ApiTags('Temporada')
@Controller('temporada')
export class TemporadaController {
  constructor(private readonly temporadaService: TemporadaService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva temporada',
    description: 'Registra una nueva temporada del programa MasterChef'
  })
  @ApiBody({ type: CreateTemporadaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Temporada creada exitosamente',
    type: CreateTemporadaDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos'
  })
  create(@Body() createTemporadaDto: CreateTemporadaDto) {
    return this.temporadaService.create(createTemporadaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las temporadas',
    description: 'Devuelve una lista con todas las temporadas registradas'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de temporadas obtenida exitosamente',
    type: [CreateTemporadaDto]
  })
  findAll() {
    return this.temporadaService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una temporada por ID',
    description: 'Devuelve los detalles de una temporada específica'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la temporada',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Temporada encontrada exitosamente',
    type: CreateTemporadaDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Temporada no encontrada'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido'
  })
  findOne(@Param('id') id: string) {
    return this.temporadaService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una temporada',
    description: 'Elimina permanentemente una temporada del sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la temporada a eliminar',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Temporada eliminada exitosamente',
    schema: {
      example: {
        mensaje: 'Temporada eliminada exitosamente',
        temporada: { /* datos de la temporada eliminada */ }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Temporada no encontrada'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido'
  })
  remove(@Param('id') id: string) {
    return this.temporadaService.remove(id);
  }
}
