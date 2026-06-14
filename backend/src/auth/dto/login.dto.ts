import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  /*
    Puede ser correo o nombre de usuario.
  */
  @IsNotEmpty({ message: 'Debe ingresar correo o nombre de usuario' })
  @IsString()
  identificador!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe tener al menos una mayúscula y un número',
  })
  password!: string;
}
