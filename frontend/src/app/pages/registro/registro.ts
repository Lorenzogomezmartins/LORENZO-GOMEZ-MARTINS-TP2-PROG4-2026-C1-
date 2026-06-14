import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  imagenSeleccionada: File | null = null;
  mensaje = '';
  error = '';

  registroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required]],
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
      perfil: ['usuario', [Validators.required]],
    });
  }

  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  registrar() {
    this.mensaje = '';
    this.error = '';

    if (this.registroForm.invalid) {
      this.error = 'Revisá los campos del formulario.';
      this.registroForm.markAllAsTouched();
      return;
    }

    const valores = this.registroForm.value;

    if (valores.password !== valores.repetirPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const formData = new FormData();

    formData.append('nombre', valores.nombre || '');
    formData.append('apellido', valores.apellido || '');
    formData.append('correo', valores.correo || '');
    formData.append('nombreUsuario', valores.nombreUsuario || '');
    formData.append('password', valores.password || '');
    formData.append('fechaNacimiento', valores.fechaNacimiento || '');
    formData.append('descripcion', valores.descripcion || '');
    formData.append('perfil', valores.perfil || 'usuario');

    if (this.imagenSeleccionada) {
      formData.append('imagenPerfil', this.imagenSeleccionada);
    }

    this.authService.registrar(formData).subscribe({
      next: () => {
        this.mensaje = 'Usuario registrado correctamente.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 800);
      },
      error: (err) => {
        this.error =
          err.error?.message || 'No se pudo registrar el usuario.';
      },
    });
  }
}