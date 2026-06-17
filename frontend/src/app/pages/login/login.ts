import { Component } from '@angular/core'; // Decorador para definir componentes de Angular
import { CommonModule } from '@angular/common'; // Permite usar directivas como *ngIf y *ngFor

import {
  FormBuilder, // Facilita la creación de formularios reactivos
  FormGroup, // Representa un formulario reactivo
  ReactiveFormsModule, // Habilita formularios reactivos
  Validators, // Validadores incorporados de Angular
} from '@angular/forms';

import {
  Router, // Permite navegar entre páginas
  RouterLink, // Permite crear enlaces de navegación en el HTML
} from '@angular/router';

import { AuthService } from '../../services/auth'; // Servicio encargado de login y sesión

// Define el componente Login
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  // Mensaje de error mostrado en pantalla
  error = '';

  // Formulario reactivo
  loginForm!: FormGroup;

  // Inyección de dependencias
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {

    // Creación del formulario de login
    this.loginForm = this.fb.group({

      // Correo o nombre de usuario
      identificador: [
        '',
        [Validators.required],
      ],

      // Contraseña
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
    });
  }

  // =====================================================
  // INICIAR SESIÓN
  // =====================================================

  ingresar() {

    // Limpia errores anteriores
    this.error = '';

    // Verifica si el formulario es válido
    if (this.loginForm.invalid) {

      this.error =
        'Completá correctamente los campos.';

      // Marca todos los campos para mostrar errores
      this.loginForm.markAllAsTouched();

      return;
    }

    // Llama al backend para validar credenciales
    this.authService
      .login({
        identificador:
          this.loginForm.value.identificador || '',

        password:
          this.loginForm.value.password || '',
      })
      .subscribe({

        // Login correcto
        next: (resp: any) => {

          // Guarda el usuario en localStorage
          this.authService.guardarUsuario(
            resp.usuario,
          );

          // Redirige a publicaciones
          this.router.navigate([
            '/publicaciones',
          ]);
        },

        // Error de login
        error: (err) => {

          this.error =
            err.error?.message ||
            'No se pudo iniciar sesión.';
        },
      });
  }
}