import { CommonModule } from '@angular/common'; // Permite usar directivas como *ngIf y *ngFor
import { Component, OnInit } from '@angular/core'; // Component define el componente y OnInit ejecuta lógica al iniciar

import {
  FormBuilder, // Facilita la creación de formularios reactivos
  FormGroup, // Representa un formulario reactivo
  ReactiveFormsModule, // Habilita formularios reactivos
  Validators, // Validadores de Angular
} from '@angular/forms';

import { UsuariosService } from '../../services/usuarios.service'; // Servicio para consumir rutas de usuarios

import { NombreCompletoPipe } from '../../pipes/nombre-completo.pipe'; // Pipe para mostrar nombre + apellido
import { PerfilTextoPipe } from '../../pipes/perfil-texto.pipe'; // Pipe para mostrar el perfil con texto amigable
import { EstadoUsuarioPipe } from '../../pipes/estado-usuario.pipe'; // Pipe para mostrar Habilitado/Deshabilitado

import { ResaltarAdminDirective } from '../../directives/resaltar-admin.directive'; // Directiva para resaltar administradores
import { DeshabilitadoOpacoDirective } from '../../directives/deshabilitado-opaco.directive'; // Directiva para mostrar opaco usuarios deshabilitados

// Componente del dashboard de administración de usuarios
@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NombreCompletoPipe,
    PerfilTextoPipe,
    EstadoUsuarioPipe,
    ResaltarAdminDirective,
    DeshabilitadoOpacoDirective,
  ],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.scss',
})
export class DashboardUsuarios implements OnInit {
  // Lista de usuarios obtenida desde el backend
  usuarios: any[] = [];
  // Mensaje de éxito
  mensaje = '';
  // Mensaje de error
  error = '';
  // Formulario para crear usuarios desde admin
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
  ) {
    // Crea el formulario con sus validaciones
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(250)]],
      perfil: ['usuario', Validators.required],
    });
  }

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // Carga todos los usuarios desde el backend
  cargarUsuarios() {
    this.usuariosService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: () => {
        this.error = 'No se pudieron cargar los usuarios.';
      },
    });
  }

  // Crea un usuario nuevo desde el dashboard admin
  crearUsuario() {
    this.mensaje = '';
    this.error = '';

    // Si el formulario es inválido, muestra error y corta
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Completá todos los campos correctamente.';
      return;
    }

    // Envía los datos al backend
    this.usuariosService.crearUsuario(this.form.value).subscribe({
      next: () => {
        this.mensaje = 'Usuario creado correctamente.';

        // Limpia el formulario y deja perfil usuario por defecto
        this.form.reset({
          perfil: 'usuario',
        });

        // Recarga la lista actualizada
        this.cargarUsuarios();
      },
      error: (err) => {
        this.error =
          err.error?.message ||
          'No se pudo crear el usuario.';
      },
    });
  }

  // Deshabilita un usuario mediante baja lógica
  deshabilitarUsuario(id: string) {
    this.usuariosService.deshabilitarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => {
        this.error = 'No se pudo deshabilitar el usuario.';
      },
    });
  }

  // Habilita nuevamente un usuario
  habilitarUsuario(id: string) {
    this.usuariosService.habilitarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => {
        this.error = 'No se pudo habilitar el usuario.';
      },
    });
  }
}