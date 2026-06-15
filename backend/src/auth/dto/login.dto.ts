import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'; // Decoradores de validación

export class LoginDto {
  // Permite ingresar correo o nombre de usuario
  @IsNotEmpty({ message: 'Debe ingresar correo o nombre de usuario' }) // Campo obligatorio
  @IsString() // Debe ser texto
  identificador!: string;

  @IsString() // Debe ser texto
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' }) // Mínimo 8 caracteres
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    // Debe contener al menos una mayúscula y un número
    message: 'La contraseña debe tener al menos una mayúscula y un número',
  })
  password!: string;
}
