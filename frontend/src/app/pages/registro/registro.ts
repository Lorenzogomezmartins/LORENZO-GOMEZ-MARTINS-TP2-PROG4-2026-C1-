import { Component } from '@angular/core'; // Decorador para definir un componente de Angular
import { CommonModule } from '@angular/common'; // Permite usar directivas como *ngIf y *ngFor

import {
  FormBuilder, // Facilita la creación de formularios reactivos
  FormGroup, // Representa un formulario reactivo
  ReactiveFormsModule, // Habilita formularios reactivos
  Validators, // Validadores incorporados de Angular
} from '@angular/forms';

import { Router } from '@angular/router'; // Permite navegar entre páginas

import { AuthService } from '../../services/auth'; // Servicio encargado del registro y login

// Define el componente de registro
@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {

  // Imagen seleccionada por el usuario
  imagenSeleccionada: File | null = null;

  // Mensaje de éxito
  mensaje = '';

  // Mensaje de error
  error = '';

  // Formulario reactivo
  registroForm!: FormGroup;

  // Inyección de dependencias
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {

    // Creación del formulario con validaciones
    this.registroForm = this.fb.group({

      nombre: ['', [Validators.required]],

      apellido: ['', [Validators.required]],

      correo: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],

      nombreUsuario: [
        '',
        [Validators.required],
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),

          // Debe contener:
          // - una mayúscula
          // - un número
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d).+$/,
          ),
        ],
      ],

      repetirPassword: [
        '',
        [Validators.required],
      ],

      fechaNacimiento: [
        '',
        [Validators.required],
      ],

      descripcion: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
        ],
      ],

      perfil: [
        'usuario',
        [Validators.required],
      ],
    });
  }

  // =====================================================
  // SELECCIONAR IMAGEN
  // =====================================================

  seleccionarImagen(event: Event) {

    const input =
      event.target as HTMLInputElement;

    // Guarda la imagen seleccionada
    if (
      input.files &&
      input.files.length > 0
    ) {
      this.imagenSeleccionada =
        input.files[0];
    }
  }

  // =====================================================
  // REGISTRAR USUARIO
  // =====================================================

  registrar() {

    // Limpia mensajes anteriores
    this.mensaje = '';
    this.error = '';

    // Verifica que el formulario sea válido
    if (this.registroForm.invalid) {

      this.error =
        'Revisá los campos del formulario.';

      // Marca todos los campos para mostrar errores
      this.registroForm.markAllAsTouched();

      return;
    }

    // Obtiene todos los valores del formulario
    const valores =
      this.registroForm.value;

    // Verifica que ambas contraseñas coincidan
    if (
      valores.password !==
      valores.repetirPassword
    ) {
      this.error =
        'Las contraseñas no coinciden.';
      return;
    }

    // FormData permite enviar texto + archivos
    const formData = new FormData();

    // Agrega todos los campos al FormData
    formData.append(
      'nombre',
      valores.nombre || '',
    );

    formData.append(
      'apellido',
      valores.apellido || '',
    );

    formData.append(
      'correo',
      valores.correo || '',
    );

    formData.append(
      'nombreUsuario',
      valores.nombreUsuario || '',
    );

    formData.append(
      'password',
      valores.password || '',
    );

    formData.append(
      'fechaNacimiento',
      valores.fechaNacimiento || '',
    );

    formData.append(
      'descripcion',
      valores.descripcion || '',
    );

    formData.append(
      'perfil',
      valores.perfil || 'usuario',
    );

    // Agrega imagen si existe
    if (this.imagenSeleccionada) {
      formData.append(
        'imagenPerfil',
        this.imagenSeleccionada,
      );
    }

    // Envía el registro al backend
    this.authService
      .registrar(formData)
      .subscribe({

        // Registro exitoso
        next: () => {

          this.mensaje =
            'Usuario registrado correctamente.';

          // Redirige al login luego de 800 ms
          setTimeout(() => {
            this.router.navigate([
              '/login',
            ]);
          }, 800);
        },

        // Error de registro
        error: (err) => {
          this.error =
            err.error?.message ||
            'No se pudo registrar el usuario.';
        },
      });
  }
}