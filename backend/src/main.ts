import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /*
    Habilitamos CORS para que Angular, que corre en localhost:4200,
    pueda consumir este backend en localhost:3000.
  */
  app.enableCors({
    origin: 'http://localhost:4200',
  });

  /*
    ValidationPipe hace que funcionen las validaciones de los DTOs.
    Ejemplo: correo obligatorio, contraseña mínima, etc.
  */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  /*
    Servimos públicamente la carpeta uploads.
    Si guardamos una imagen como uploads/foto.png,
    se podrá ver desde http://localhost:3000/uploads/foto.png
  */
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
