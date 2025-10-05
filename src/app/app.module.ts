import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecetasModule } from '../recetas/recetas.module';
import { AuthModule } from '../auth/auth.module';
import { TemporadaModule } from '../temporada/temporada.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongoDB'),
    RecetasModule, AuthModule, TemporadaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
