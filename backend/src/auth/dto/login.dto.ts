import {
  IsNotEmpty, // Valida que el campo no esté vacío
  IsString, // Valida que el valor sea un texto (string)
  Matches, // Valida usando una expresión regular (regex)
  MinLength, // Valida longitud mínima
} from 'class-validator';

// DTO utilizado para validar los datos del login
export class LoginDto {

  /*
    Puede recibir:
    - correo electrónico
    - nombre de usuario
  */
  @IsNotEmpty({
    message: 'Debe ingresar correo o nombre de usuario',
  })
  @IsString()
  identificador!: string;

  // Contraseña del usuario
  @IsString()

  // Mínimo 8 caracteres
  @MinLength(8, {
    message:
      'La contraseña debe tener al menos 8 caracteres',
  })

  // Debe contener al menos:
  // - una letra mayúscula
  // - un número
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe tener al menos una mayúscula y un número',
  })
  password!: string;
}