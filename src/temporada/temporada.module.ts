import { Module } from '@nestjs/common';
import { TemporadaService } from './temporada.service';
import { TemporadaController } from './temporada.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Temporada, TemporadaSchema } from './entities/temporada.entity';
import { Receta, RecetaSchema } from 'src/recetas/entities/receta.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Temporada.name, schema: TemporadaSchema },
      { name: Receta.name, schema: RecetaSchema }
    ])
  ],
  controllers: [TemporadaController],
  providers: [TemporadaService],
})
export class TemporadaModule {}
