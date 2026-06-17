import {
  IsEmail, // Valida que el texto tenga formato de correo electrónico
  IsIn, // Valida que el valor pertenezca a una lista de opciones
  IsNotEmpty, // Valida que el campo no esté vacío
  IsOptional, // Indica que el campo es opcional
  IsString, // Valida que el valor sea un string
  Matches, // Valida usando expresiones regulares (regex)
  MaxLength, // Valida longitud máxima
  MinLength, // Valida longitud mínima
} from 'class-validator';

// DTO utilizado para validar los datos del registro
export class RegistroDto {

  // Nombre obligatorio
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  // Apellido obligatorio
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  apellido: string;

  // Correo con formato válido
  @IsEmail({}, {
    message: 'El correo no tiene un formato válido',
  })
  correo: string;

  // Nombre de usuario obligatorio
  @IsNotEmpty({
    message: 'El nombre de usuario es obligatorio',
  })
  @IsString()
  nombreUsuario: string;

  // Contraseña:
  // - mínimo 8 caracteres
  // - al menos una mayúscula
  // - al menos un número
  @IsString()

  @MinLength(8, {
    message:
      'La contraseña debe tener al menos 8 caracteres',
  })

  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe tener al menos una mayúscula y un número',
  })
  password: string;

  // Fecha de nacimiento obligatoria
  @IsNotEmpty({
    message:
      'La fecha de nacimiento es obligatoria',
  })
  fechaNacimiento: string;

  // Descripción de perfil
  // Máximo 250 caracteres
  @IsString()

  @MaxLength(250, {
    message:
      'La descripción no puede superar los 250 caracteres',
  })
  descripcion: string;

  // Perfil opcional
  // Solo puede ser usuario o administrador
  @IsOptional()

  @IsIn([
    'usuario',
    'administrador',
  ])
  perfil?: string;
}