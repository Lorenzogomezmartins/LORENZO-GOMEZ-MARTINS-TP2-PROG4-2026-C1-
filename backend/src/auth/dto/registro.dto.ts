import {
  IsEmail, // Valida formato de correo electrónico
  IsIn, // Valida que el valor pertenezca a una lista
  IsNotEmpty, // Valida que el campo no esté vacío
  IsOptional, // Indica que el campo es opcional
  IsString, // Valida que sea texto
  Matches, // Valida mediante una expresión regular (Regex)
  MaxLength, // Define una longitud máxima
  MinLength, // Define una longitud mínima
} from 'class-validator';

export class RegistroDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' }) // Campo obligatorio
  @IsString() // Debe ser texto
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  apellido: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' }) // Debe tener formato email
  correo: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString()
  nombreUsuario: string;

  // Debe tener al menos 8 caracteres, una mayúscula y un número
  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe tener al menos una mayúscula y un número',
  })
  password: string;

  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  fechaNacimiento: string;

  @IsString()
  @MaxLength(250, {
    message: 'La descripción no puede superar los 250 caracteres',
  })
  descripcion: string;

  @IsOptional() // No es obligatorio enviarlo
  @IsIn(['usuario', 'administrador']) // Solo permite estos dos valores
  perfil?: string;
}
