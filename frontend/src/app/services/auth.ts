import { HttpClient } from '@angular/common/http'; // Servicio para realizar peticiones HTTP al backend
import { Injectable } from '@angular/core'; // Permite que el servicio pueda inyectarse en cualquier componente

// Hace que este servicio esté disponible en toda la aplicación
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // URL base del módulo de autenticación del backend
   private apiUrl = 'https://redsocial-backend-fy2b.onrender.com/auth';

  // Inyección de HttpClient
  constructor(private http: HttpClient) {}

  // =====================================================
  // REGISTRO
  // =====================================================

  /*
    Registro utiliza FormData porque envía:
    - texto
    - imagen de perfil
  */
  registrar(datos: FormData) {
    return this.http.post(
      `${this.apiUrl}/registro`,
      datos,
    );
  }

  // =====================================================
  // LOGIN
  // =====================================================

  /*
    Login utiliza JSON porque solamente envía:
    - identificador
    - contraseña
  */
  login(
    credenciales: {
      identificador: string;
      password: string;
    },
  ) {
    return this.http.post(
      `${this.apiUrl}/login`,
      credenciales,
    );
  }

  // =====================================================
  // GUARDAR USUARIO
  // =====================================================

  guardarUsuario(usuario: any) {

    // Convierte el objeto a JSON y lo guarda en localStorage
    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario),
    );
  }

  // =====================================================
  // OBTENER USUARIO
  // =====================================================

  obtenerUsuario() {

    // Busca el usuario almacenado en localStorage
    const usuario = localStorage.getItem('usuario');

    // Si existe, lo convierte nuevamente a objeto
    // Si no existe, devuelve null
    return usuario
      ? JSON.parse(usuario)
      : null;
  }

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  cerrarSesion() {

    // Elimina el usuario almacenado
    localStorage.removeItem('usuario');
  }
}