// Decorador para definir un componente de Angular.
import { Component } from '@angular/core';

// Módulo con directivas comunes como *ngIf y *ngFor.
import { CommonModule } from '@angular/common';

// Herramientas para crear y validar formularios reactivos.
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Permite navegar entre rutas desde TypeScript.
import { Router } from '@angular/router';

// Servicio usado para enviar el registro al backend.
import { AuthService } from '../../services/auth';

@Component({
  // Etiqueta HTML que representa este componente.
  selector: 'app-registro',

  // Módulos necesarios para usar directivas y formularios reactivos.
  imports: [CommonModule, ReactiveFormsModule],

  // HTML asociado al componente.
  templateUrl: './registro.html',

  // Estilos asociados al componente.
  styleUrl: './registro.scss',
})
export class Registro {
  // Guarda la imagen elegida por el usuario.
  imagenSeleccionada: File | null = null;

  // Mensaje de éxito para mostrar en pantalla.
  mensaje = '';

  // Mensaje de error para mostrar en pantalla.
  error = '';

  // Formulario reactivo de registro.
  registroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    // Crea el formulario con sus campos y validaciones.
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required]],

      // Contraseña obligatoria, mínimo 8 caracteres, una mayúscula y un número.
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],

      repetirPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],

      // Por defecto todo usuario registrado tiene perfil "usuario".
      perfil: ['usuario', [Validators.required]],
    });
  }

  // Devuelve el control de la contraseña para usarlo fácilmente en el HTML.
  get passwordControl() {
    return this.registroForm.get('password');
  }

  // Verifica si la contraseña tiene al menos una mayúscula.
  tieneMayuscula(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  // Verifica si la contraseña tiene al menos un número.
  tieneNumero(password: string): boolean {
    return /\d/.test(password);
  }

  // Guarda el archivo de imagen seleccionado desde el input file.
  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    // Si el usuario eligió un archivo, guarda el primero.
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  // Envía el formulario de registro al backend.
  registrar() {
    // Limpia mensajes anteriores.
    this.mensaje = '';
    this.error = '';

    // Si el formulario es inválido, muestra error y marca los campos tocados.
    if (this.registroForm.invalid) {
      this.error = 'Revisá los campos del formulario.';
      this.registroForm.markAllAsTouched();
      return;
    }

    // Obtiene los valores cargados en el formulario.
    const valores = this.registroForm.value;

    // Valida que ambas contraseñas coincidan.
    if (valores.password !== valores.repetirPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    // FormData permite enviar texto e imagen en la misma petición.
    const formData = new FormData();

    // Agrega cada campo del formulario al FormData.
    formData.append('nombre', valores.nombre || '');
    formData.append('apellido', valores.apellido || '');
    formData.append('correo', valores.correo || '');
    formData.append('nombreUsuario', valores.nombreUsuario || '');
    formData.append('password', valores.password || '');
    formData.append('fechaNacimiento', valores.fechaNacimiento || '');
    formData.append('descripcion', valores.descripcion || '');
    formData.append('perfil', valores.perfil || 'usuario');

    // Si se seleccionó imagen, también se agrega al FormData.
    if (this.imagenSeleccionada) {
      formData.append('imagenPerfil', this.imagenSeleccionada);
    }

    // Envía los datos al servicio de autenticación.
    this.authService.registrar(formData).subscribe({
      // Si el registro sale bien, muestra mensaje y redirige al login.
      next: () => {
        this.mensaje = 'Usuario registrado correctamente.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 800);
      },

      // Si el backend responde con error, muestra el mensaje correspondiente.
      error: (err) => {
        this.error =
          err.error?.message || 'No se pudo registrar el usuario.';
      },
    });
  }
}