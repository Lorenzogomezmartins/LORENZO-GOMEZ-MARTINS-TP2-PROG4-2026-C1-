import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://redsocial-backend-fy2b.onrender.com/auth';

  constructor(private http: HttpClient) {}

  registrar(datos: FormData) {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  login(credenciales: { identificador: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credenciales);
  }

  guardarSesion(usuario: any, token: string) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
  }

  guardarUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogueado(): boolean {
    return this.obtenerToken() !== null;
  }

  autorizar() {
    return this.http.post<any>(
      `${this.apiUrl}/autorizar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.obtenerToken()}`,
        },
      }
    );
  }

  refrescarToken() {
    return this.http.post<any>(
      `${this.apiUrl}/refrescar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${this.obtenerToken()}`,
        },
      }
    );
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
}