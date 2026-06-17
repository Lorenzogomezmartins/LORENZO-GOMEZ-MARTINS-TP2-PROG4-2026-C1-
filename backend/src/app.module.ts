import { Module } from '@nestjs/common'; // Decorador para definir módulos en NestJS
import { ConfigModule } from '@nestjs/config'; // Permite leer variables del archivo .env
import { MongooseModule } from '@nestjs/mongoose'; // Permite conectar NestJS con MongoDB

import { AuthModule } from './auth/auth.module'; // Módulo de autenticación
import { UsuariosModule } from './usuarios/usuarios.module'; // Módulo de usuarios
import { PublicacionesModule } from './publicaciones/publicaciones.module'; // Módulo de publicaciones

// Módulo principal de la aplicación
@Module({
  imports: [
    // Carga las variables de entorno (.env) de forma global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conecta la aplicación a MongoDB usando la URI del .env
    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    // Importa los módulos de la aplicación
    AuthModule,
    UsuariosModule,
    PublicacionesModule,
  ],
})
export class AppModule {}