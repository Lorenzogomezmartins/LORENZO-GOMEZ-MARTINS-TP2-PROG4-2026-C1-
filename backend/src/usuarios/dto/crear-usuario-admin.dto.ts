import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CrearUsuarioAdminDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  nombreUsuario!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe tener al menos una mayúscula y un número',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  fechaNacimiento!: string;

  @IsString()
  @MaxLength(250)
  descripcion!: string;

  @IsEnum(['usuario', 'administrador'])
  perfil!: 'usuario' | 'administrador';
}