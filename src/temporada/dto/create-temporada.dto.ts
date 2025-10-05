import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemporadaDto {
  @ApiProperty({
    description: 'Nombre descriptivo de la temporada',
    example: 'MasterChef España 2024'
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Número de la temporada',
    example: 12,
    type: Number
  })
  @IsNumber()
  @IsNotEmpty()
  temporada: number;
}