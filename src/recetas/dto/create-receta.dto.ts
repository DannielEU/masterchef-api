import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecetaDto {
  @ApiProperty({
    description: 'Nombre de la receta',
    example: 'Paella Valenciana'
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada de la receta',
    example: 'Receta tradicional de paella valenciana con pollo y conejo'
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'Lista de ingredientes necesarios',
    type: [String],
    example: ['arroz', 'pollo', 'conejo', 'judías verdes', 'garrofón', 'tomate', 'azafrán']
  })
  @IsArray()
  @IsString({ each: true })
  ingredientes: string[];

  @ApiProperty({
    description: 'Pasos para preparar la receta',
    type: [String],
    example: ['Sofreír el pollo y conejo', 'Añadir las verduras', 'Agregar el arroz y el caldo', 'Cocinar 18 minutos']
  })
  @IsArray()
  @IsString({ each: true })
  pasos: string[];

  @ApiProperty({
    description: 'Tiempo de preparación en minutos',
    example: 60,
    required: false
  })
  @IsNumber()
  @IsOptional()
  tiempoPreparacion?: number;

  @ApiProperty({
    description: 'ID de la temporada a la que pertenece la receta',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId()
  @IsNotEmpty()
  temporadaId: string;

  @ApiProperty({
    description: 'ID del usuario que crea la receta',
    example: '507f1f77bcf86cd799439022',
    required: false
  })
  @IsMongoId()
  @IsOptional()
  creadoPorId?: string;
}