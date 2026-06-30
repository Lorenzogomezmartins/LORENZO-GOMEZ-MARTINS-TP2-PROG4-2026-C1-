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

// Permite navegar entre páginas y usar enlaces mediante RouterLink.
import { Router, RouterLink } from '@angular/router';

// Servicio encargado de la autenticación.
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Mensaje de error mostrado en pantalla.
  error = '';
  // Formulario reactivo de login.
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    // Crea el formulario con sus validaciones.
    this.loginForm = this.fb.group({
      // Permite ingresar correo o nombre de usuario.
      identificador: ['', [Validators.required]],

      // Contraseña obligatoria con las mismas reglas que el registro.
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
    });
  }

  // Procesa el inicio de sesión.
  ingresar() {
    // Limpia errores anteriores.
    this.error = '';

    // Verifica que el formulario sea válido.
    if (this.loginForm.invalid) {
      this.error = 'Completá correctamente los campos.';
      this.loginForm.markAllAsTouched();
      return;
    }

    // Envía las credenciales al backend.
    this.authService
      .login({
        identificador: this.loginForm.value.identificador || '',
        password: this.loginForm.value.password || '',
      })
      .subscribe({
        // Si el login es correcto, guarda el usuario y navega a publicaciones.
        next: (resp: any) => {
  localStorage.setItem('token', resp.token);
  this.authService.guardarUsuario(resp.usuario);
  this.router.navigate(['/publicaciones']);
},

        // Si ocurre un error, muestra el mensaje correspondiente.
        error: (err) => {
          this.error =
            err.error?.message || 'No se pudo iniciar sesión.';
        },
      });
  }
}