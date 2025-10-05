import { Injectable } from '@nestjs/common';
import { CreateTemporadaDto } from './dto/create-temporada.dto';
import { UpdateTemporadaDto } from './dto/update-temporada.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Temporada } from './entities/temporada.entity';
import { Model } from 'mongoose';
import { HttpException } from '@nestjs/common';
import { Receta } from '../recetas/entities/receta.entity'; 

@Injectable()
export class TemporadaService {
  constructor(
    @InjectModel(Temporada.name) private temporadaModel: Model<Temporada>,
    @InjectModel(Receta.name) private recetaModel: Model<Receta>
  ) {}

  async create(createTemporadaDto: CreateTemporadaDto) {
    try {
      const temporada = new this.temporadaModel(createTemporadaDto);
      return await temporada.save();
    } catch (error) {
      throw new HttpException('Error al crear temporada', 500);
    }
  }

  async findAll() {
    try {
      return await this.temporadaModel.find().exec();
    } catch (error) {
      throw new HttpException('Error al buscar temporadas', 500);
    }
  }

  async findOne(id: string) {
    try {
      const temporada = await this.temporadaModel.findById(id).exec();
      
      if (!temporada) {
        throw new HttpException('Temporada no encontrada', 404);
      }
      
      return temporada;
      
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('ID inválido', 400);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al buscar temporada', 500);
    }
  }

  async remove(id: string) {
    try {
      const temporada = await this.temporadaModel
        .findByIdAndDelete(id)
        .exec();
        
      if (!temporada) {
        throw new HttpException('Temporada no encontrada', 404);
      }

      const recetasEliminadas = await this.recetaModel
        .deleteMany({ temporadaId: id })
        .exec();
      
      return { 
        mensaje: 'Temporada eliminada exitosamente y relacionados', 
        temporada,
        recetasEliminadas: recetasEliminadas.deletedCount 
      };
      
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('ID inválido', 400);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al eliminar temporada', 500);
    }
  }
}