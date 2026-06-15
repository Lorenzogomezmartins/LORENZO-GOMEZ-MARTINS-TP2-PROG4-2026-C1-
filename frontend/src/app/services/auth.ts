// Servicio encargado de la autenticación y gestión de sesión del usuario.
import { HttpClient } from '@angular/common/http';

// Permite que Angular pueda inyectar este servicio en otros componentes.
import { Injectable } from '@angular/core';

@Injectable({
  // Hace que el servicio esté disponible en toda la aplicación.
  providedIn: 'root',
})
export class AuthService {

  // URL base de los endpoints de autenticación del backend.
  private apiUrl = 'http://localhost:3000/auth';

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

  // Guarda los datos del usuario en el almacenamiento local del navegador.
  guardarUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  // Obtiene los datos del usuario almacenados en localStorage.
  obtenerUsuario() {
    const usuario = localStorage.getItem('usuario');

    // Si existe información guardada, la convierte nuevamente a objeto.
    return usuario ? JSON.parse(usuario) : null;
  }

  // Elimina la sesión del usuario almacenada localmente.
  cerrarSesion() {
    localStorage.removeItem('usuario');
  }
}