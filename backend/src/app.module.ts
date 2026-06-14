import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';

@Module({
  imports: [
    /*
      ConfigModule permite leer variables del archivo .env.
      Ejemplo: MONGO_URI.
    */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /*
      Conexión a MongoDB usando la URI del .env.
    */
    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    AuthModule,
    UsuariosModule,
    PublicacionesModule,
  ],
})
export class AppModule {}
