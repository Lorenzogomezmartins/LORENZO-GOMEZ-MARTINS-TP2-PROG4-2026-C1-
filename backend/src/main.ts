/**
 * ============================================
 * MAIN.TS
 * ============================================
 *
 * Este es el punto de entrada principal de la aplicación.
 *
 * Su responsabilidad es:
 * 1. Crear la aplicación NestJS.
 * 2. Configurar CORS para permitir peticiones del frontend.
 * 3. Configurar validaciones globales mediante DTOs.
 * 4. Exponer archivos estáticos (por ejemplo imágenes subidas).
 * 5. Levantar el servidor HTTP en un puerto determinado.
 *
 * Ejecutamos:
 * npm run start:dev
 */

import { NestFactory } from '@nestjs/core'; // Crea la aplicación NestJS
import { ValidationPipe } from '@nestjs/common'; // Valida automáticamente los DTO
import { NestExpressApplication } from '@nestjs/platform-express'; // Permite usar funciones de Express
import { join } from 'path'; // Une rutas de carpetas de forma segura
import { AppModule } from './app.module'; // Módulo principal de la aplicación

async function bootstrap() {
  // Crea la aplicación utilizando AppModule
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilita peticiones desde el frontend Angular
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true, // Permite enviar cookies y headers de autenticación
  });

  // Configura validaciones globales para todos los DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no existan en el DTO
      forbidNonWhitelisted: false, // No lanza error, simplemente las elimina
    }),
  );

  // Expone la carpeta uploads como archivos accesibles desde la URL
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Inicia el servidor en el puerto definido o 3000 por defecto
  await app.listen(process.env.PORT ?? 3000);
}

// Ejecuta la inicialización de la aplicación
bootstrap();
