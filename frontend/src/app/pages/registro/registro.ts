import { Component } from '@angular/core'; // Decorador para definir un componente de Angular
import { CommonModule } from '@angular/common'; // Módulo común que permite usar directivas como *ngIf y *ngFor
import {
  FormBuilder, // Servicio que facilita la creación de formularios reactivos
  FormGroup, // Tipo que representa un grupo de controles de formulario
  ReactiveFormsModule, // Módulo necesario para trabajar con formularios reactivos
  Validators, // Conjunto de validadores propios de Angular
} from '@angular/forms';

import { Router } from '@angular/router'; // Servicio para navegar entre rutas

import { AuthService } from '../../services/auth'; // Servicio del frontend que se comunica con el backend de autenticación

// Define este archivo como un componente de Angular
@Component({
  selector: 'app-registro', // Nombre de la etiqueta HTML del componente: <app-registro>
  imports: [CommonModule, ReactiveFormsModule], // Módulos que necesita este componente standalone
  templateUrl: './registro.html', // Archivo HTML asociado al componente
  styleUrl: './registro.scss', // Archivo SCSS asociado al componente
})
export class Registro {
  // Guarda la imagen de perfil seleccionada por el usuario
  imagenSeleccionada: File | null = null;

 
  mensaje = '';

 
  error = '';

  
  cargando = false;

  
  modalVisible = false;

 
  modalTitulo = '';

  
  modalMensaje = '';

  // Formulario reactivo de registro
  registroForm!: FormGroup;

  // Inyección de dependencias
  constructor(
    private fb: FormBuilder, // Permite construir el formulario reactivo
    private authService: AuthService, // Permite llamar al registro del backend
    private router: Router, // Permite redirigir al usuario
  ) {
    // Crea el formulario reactivo con sus campos y validaciones
    this.registroForm = this.fb.group({
      // Campo nombre obligatorio
      nombre: ['', [Validators.required]],

      // Campo apellido obligatorio
      apellido: ['', [Validators.required]],

      // Campo correo obligatorio y con formato de email
      correo: ['', [Validators.required, Validators.email]],

      // Campo nombre de usuario obligatorio
      nombreUsuario: ['', [Validators.required]],

      // Campo contraseña con varias validaciones
      password: [
        '',
        [
          Validators.required, // La contraseña es obligatoria
          Validators.minLength(8), // Debe tener al menos 8 caracteres
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), // Debe tener al menos una mayúscula y un número
        ],
      ],

      // Campo para repetir la contraseña
      repetirPassword: ['', [Validators.required]],

      // Campo fecha de nacimiento obligatorio
      fechaNacimiento: ['', [Validators.required]],

      // Campo descripción obligatorio y máximo 250 caracteres
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],

      // Perfil por defecto del usuario
      perfil: ['usuario', [Validators.required]],
    });
  }

  // Getter para acceder más fácil al control de contraseña desde el HTML
  get passwordControl() {
    return this.registroForm.get('password');
  }

  // Verifica si la contraseña contiene al menos una letra mayúscula
  tieneMayuscula(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  // Verifica si la contraseña contiene al menos un número
  tieneNumero(password: string): boolean {
    return /\d/.test(password);
  }

  // Guarda la imagen seleccionada desde el input type="file"
  seleccionarImagen(event: Event) {
    // Convierte el target del evento a HTMLInputElement
    const input = event.target as HTMLInputElement;

    // Si hay archivos seleccionados, guarda el primero
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  // Muestra el modal con un título y mensaje personalizados
  mostrarModal(titulo: string, mensaje: string) {
    this.modalTitulo = titulo; // Asigna el título del modal
    this.modalMensaje = mensaje; // Asigna el mensaje del modal
    this.modalVisible = true; // Hace visible el modal
  }

  // Cierra el modal y redirige al login
  cerrarModal() {
    this.modalVisible = false; // Oculta el modal
    this.router.navigate(['/login']); // Redirige al usuario a la pantalla de login
  }

  // Ejecuta el registro del usuario
  registrar() {
    // Limpia mensajes anteriores
    this.mensaje = '';
    this.error = '';

    // Si el formulario no cumple las validaciones, se corta el proceso
    if (this.registroForm.invalid) {
      this.error = 'Revisá los campos del formulario.';

      // Marca todos los campos como tocados para mostrar errores en el HTML
      this.registroForm.markAllAsTouched();

      return;
    }

    // Obtiene todos los valores cargados en el formulario
    const valores = this.registroForm.value;

    // Valida manualmente que ambas contraseñas coincidan
    if (valores.password !== valores.repetirPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    // FormData permite enviar texto + archivos al backend
    const formData = new FormData();

    // Agrega cada campo del formulario al FormData
    formData.append('nombre', valores.nombre || '');
    formData.append('apellido', valores.apellido || '');
    formData.append('correo', valores.correo || '');
    formData.append('nombreUsuario', valores.nombreUsuario || '');
    formData.append('password', valores.password || '');
    formData.append('fechaNacimiento', valores.fechaNacimiento || '');
    formData.append('descripcion', valores.descripcion || '');
    formData.append('perfil', valores.perfil || 'usuario');

    // Si el usuario seleccionó una imagen, también se agrega al FormData
    if (this.imagenSeleccionada) {
      formData.append('imagenPerfil', this.imagenSeleccionada);
    }

    // Activa estado de carga mientras se espera la respuesta del backend
    this.cargando = true;

    // Llama al AuthService para enviar el registro al backend
    this.authService.registrar(formData).subscribe({
      // Si el backend registra correctamente al usuario
      next: () => {
        // Desactiva estado de carga
        this.cargando = false;

        // Muestra modal de éxito
        this.mostrarModal(
          'Usuario registrado correctamente',
          'Tu cuenta fue creada. Ahora iniciá sesión para entrar a la red social.',
        );
      },

      // Si ocurre un error desde el backend
      error: (err) => {
        // Desactiva estado de carga
        this.cargando = false;

        // Muestra el mensaje de error enviado por el backend o uno genérico
        this.error =
          err.error?.message || 'No se pudo registrar el usuario.';
      },
    });
  }
}