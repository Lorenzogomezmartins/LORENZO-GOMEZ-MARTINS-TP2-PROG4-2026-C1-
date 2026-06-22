import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  error = '';
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      identificador: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
        ],
      ],

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

  ingresar() {
    this.error = '';

    if (this.loginForm.invalid) {
      this.error = 'Completá correctamente los campos.';
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService
      .login({
        identificador: this.loginForm.value.identificador || '',
        password: this.loginForm.value.password || '',
      })
      .subscribe({
        next: (resp: any) => {
          this.authService.guardarUsuario(resp.usuario);
          this.router.navigate(['/publicaciones']);
        },
        error: (err) => {
          this.error =
            err.error?.message || 'No se pudo iniciar sesión.';
        },
      });
  }
}