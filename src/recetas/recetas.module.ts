import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Receta, RecetaSchema } from './entities/receta.entity'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Receta.name, schema: RecetaSchema }])
  ],
  controllers: [RecetasController],
  providers: [RecetasService],
})
export class RecetasModule {}
