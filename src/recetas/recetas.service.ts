import { HttpException, Injectable } from '@nestjs/common';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { Model } from 'mongoose';
import { Receta, RecetaDocument } from './entities/receta.entity';
import { InjectModel } from '@nestjs/mongoose';
import { QueryReceta } from './interface/recetaQuery';

@Injectable()
export class RecetasService {
  constructor(
    @InjectModel(Receta.name) private recetaModel: Model<RecetaDocument>
  ) {}

   async create(createRecetaDto: CreateRecetaDto) {
    const nuevaReceta = new this.recetaModel(createRecetaDto);
    return await nuevaReceta.save();
  }


  async findAll(filtros: {
  creadoPorId?: string;
  rol?: string;
  ingrediente?: string;
  temporadaId?: string;
}) {
  try {
    const query: QueryReceta = {};

    if (filtros.creadoPorId) {
      query.creadoPorId = filtros.creadoPorId;
    }
    if (filtros.ingrediente) {
      query.ingredientes = { 
        $regex: filtros.ingrediente, 
        $options: 'i'
      };
    }
    if (filtros.temporadaId) {
      query.temporadaId = filtros.temporadaId;
    }

    return await this.recetaModel
      .find(query)
      .populate('temporadaId')
      .populate({
        path: 'creadoPorId',
        match: filtros.rol ? { rol: filtros.rol } : {}
      })
      .exec();
      
  } catch (error) {
    throw new HttpException('Error al buscar recetas', 500);
  }
}


 async findOne(id: string) {
  try {
    const busqueda = await this.recetaModel
      .findById(id)
      .populate('temporadaId')
      .populate('creadoPorId')
      .exec();
    
    if (!busqueda) {
      throw new HttpException('Receta no encontrada', 404);
    }
    
    return busqueda;
    
  } catch (error) {
    if (error.name === 'CastError') {
      throw new HttpException('ID inválido', 400);
    }
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException('Error al buscar receta', 500);
  }
}

  async update(id: string, updateRecetaDto: UpdateRecetaDto) {
    try{

      const busqueda = await this.recetaModel
        .findByIdAndUpdate(id, updateRecetaDto, { new: true })
        .exec();
      if(!busqueda){
        throw new HttpException('ID no encontrado',404);
      }

      return busqueda;
    }catch(error){
      if (error.name === 'CastError') {
      throw new HttpException('ID inválido', 400);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al buscar receta', 500);
    
    }
  }

  async remove(id: string) {
  try {
    const busqueda = await this.recetaModel
      .findByIdAndDelete(id)
      .exec();
      
    if (!busqueda) {
      throw new HttpException('Receta no encontrada', 404);
    }
    
    return { mensaje: 'Receta eliminada exitosamente', receta: busqueda };
    
  } catch (error) {
    if (error.name === 'CastError') {
      throw new HttpException('ID inválido', 400);
    }
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException('Error al eliminar receta', 500);
  }
}
}
