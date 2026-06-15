import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  registrar(datos: FormData) {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  login(credenciales: { identificador: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  guardarUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
  }
}