import { IsNotEmpty, IsString } from 'class-validator';

export class CrearPublicacionDto {
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  usuarioId!: string;
}
