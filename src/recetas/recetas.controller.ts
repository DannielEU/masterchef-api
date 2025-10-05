import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';

@ApiTags('Recetas')
@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva receta',
    description: 'Registra una nueva receta en el sistema con todos sus detalles'
  })
  @ApiBody({ type: CreateRecetaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'La receta ha sido creada exitosamente',
    type: CreateRecetaDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos'
  })
  create(@Body() createRecetaDto: CreateRecetaDto) {
    return this.recetasService.create(createRecetaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las recetas',
    description: 'Devuelve una lista de recetas con filtros opcionales por creador, rol, ingrediente o temporada'
  })
  @ApiQuery({
    name: 'creadoPorId',
    required: false,
    description: 'ID del usuario creador de la receta',
    example: '507f1f77bcf86cd799439022'
  })
  @ApiQuery({
    name: 'rol',
    required: false,
    description: 'Rol del usuario creador (chef, participante, etc.)',
    example: 'chef'
  })
  @ApiQuery({
    name: 'ingrediente',
    required: false,
    description: 'Ingrediente a buscar en las recetas (búsqueda parcial, case-insensitive)',
    example: 'pollo'
  })
  @ApiQuery({
    name: 'temporadaId',
    required: false,
    description: 'ID de la temporada',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de recetas obtenida exitosamente',
    type: [CreateRecetaDto]
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al buscar recetas'
  })
  findAll(
    @Query('creadoPorId') creadoPorId?: string,
    @Query('rol') rol?: string,
    @Query('ingrediente') ingrediente?: string,
    @Query('temporadaId') temporadaId?: string
  ) {
    return this.recetasService.findAll({ creadoPorId, rol, ingrediente, temporadaId });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una receta por ID',
    description: 'Devuelve los detalles completos de una receta específica incluyendo temporada y creador'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la receta',
    example: '507f1f77bcf86cd799439033'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Receta encontrada exitosamente',
    type: CreateRecetaDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Receta no encontrada'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido'
  })
  findOne(@Param('id') id: string) {
    return this.recetasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una receta',
    description: 'Actualiza los datos de una receta existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la receta a actualizar',
    example: '507f1f77bcf86cd799439033'
  })
  @ApiBody({ type: UpdateRecetaDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Receta actualizada exitosamente',
    type: CreateRecetaDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Receta no encontrada'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido'
  })
  update(@Param('id') id: string, @Body() updateRecetaDto: UpdateRecetaDto) {
    return this.recetasService.update(id, updateRecetaDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una receta',
    description: 'Elimina permanentemente una receta del sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la receta a eliminar',
    example: '507f1f77bcf86cd799439033'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Receta eliminada exitosamente',
    schema: {
      example: {
        mensaje: 'Receta eliminada exitosamente',
        receta: { /* datos de la receta eliminada */ }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Receta no encontrada'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido'
  })
  remove(@Param('id') id: string) {
    return this.recetasService.remove(id);
  }
}
