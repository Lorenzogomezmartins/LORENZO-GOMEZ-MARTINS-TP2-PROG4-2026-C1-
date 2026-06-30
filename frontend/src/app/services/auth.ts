// Servicio encargado de la autenticación y gestión de sesión del usuario.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Permite que Angular pueda inyectar este servicio en otros componentes.
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL base de los endpoints de autenticación del backend.
  private apiUrl = 'https://redsocial-backend-fy2b.onrender.com/auth';

  // Inyección de HttpClient para realizar peticiones HTTP.
  constructor(private http: HttpClient) {}

  // Envía los datos de registro al backend.
  registrar(datos: FormData) {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  // Envía las credenciales para iniciar sesión.
  login(credenciales: { identificador: string; password: string }) {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  // Guarda el token en localStorage.
  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Obtiene el token guardado.
  obtenerToken() {
    return localStorage.getItem('token');
  }

  // Guarda los datos del usuario en localStorage.
  guardarUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  // Obtiene los datos del usuario almacenados en localStorage.
  obtenerUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Valida el token contra el backend.
  autorizar() {
    const token = this.obtenerToken() || '';

    return this.http.post(
      `${this.apiUrl}/autorizar`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      },
    );
  }

  // Refresca el token contra el backend.
  refrescarToken() {
    const token = this.obtenerToken() || '';

    return this.http.post(
      `${this.apiUrl}/refrescar`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      },
    );
  }

  // Elimina la sesión del usuario almacenada localmente.
  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
}
