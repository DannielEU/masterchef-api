import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('MasterChef API')
    .setDescription('API para gestión de recetas, temporadas y autenticación')
    .setVersion('1.0')
    .addTag('Recetas', 'Gestión de recetas del sistema')
    .addTag('Auth', 'Autenticación y registro de usuarios')
    .addTag('Temporada', 'Gestión de temporadas del programa')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
