import { IsNotEmpty, IsString } from 'class-validator'; // Validaciones para los campos

export class CrearPublicacionDto {
  @IsString() // Debe ser texto
  @IsNotEmpty() // No puede venir vacío
  titulo!: string;

  @IsString() // Debe ser texto
  @IsNotEmpty() // No puede venir vacío
  descripcion!: string;

  @IsString() // Debe ser un id en formato string
  @IsNotEmpty() // Campo obligatorio
  usuarioId!: string;
}
