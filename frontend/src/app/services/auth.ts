import { HttpClient } from '@angular/common/http'; // Permite realizar peticiones HTTP al backend
import { Injectable } from '@angular/core'; // Permite inyectar este servicio en cualquier componente

// Hace que el servicio esté disponible globalmente
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // URL base del módulo de autenticación
  private apiUrl =
    'https://redsocial-backend-fy2b.onrender.com/auth';

  // Inyección de HttpClient
  constructor(private http: HttpClient) {}

  // =====================================================
  // REGISTRO
  // =====================================================

  /*
    Envía los datos de registro al backend.

    Utiliza FormData porque envía:
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
    Envía las credenciales al backend.

    Recibe:
    - correo o nombreUsuario
    - contraseña
  */
  login(
    credenciales: {
      identificador: string;
      password: string;
    },
  ) {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      credenciales,
    );
  }

  // =====================================================
  // GUARDAR SESIÓN
  // =====================================================

  /*
    Guarda usuario y token JWT
    en localStorage.
  */
  guardarSesion(
    usuario: any,
    token: string,
  ) {

    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario),
    );

    localStorage.setItem(
      'token',
      token,
    );
  }

  // =====================================================
  // GUARDAR USUARIO
  // =====================================================

  /*
    Guarda únicamente el usuario.
  */
  guardarUsuario(usuario: any) {

    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario),
    );
  }

  // =====================================================
  // OBTENER USUARIO
  // =====================================================

  /*
    Obtiene el usuario almacenado
    en localStorage.
  */
  obtenerUsuario() {

    const usuario =
      localStorage.getItem('usuario');

    return usuario
      ? JSON.parse(usuario)
      : null;
  }

  // =====================================================
  // OBTENER TOKEN
  // =====================================================

  /*
    Obtiene el token JWT almacenado.
  */
  obtenerToken(): string | null {

    return localStorage.getItem('token');
  }

  // =====================================================
  // VERIFICAR SESIÓN
  // =====================================================

  /*
    Devuelve true si existe token.
  */
  estaLogueado(): boolean {

    return this.obtenerToken() !== null;
  }

  // =====================================================
  // AUTORIZAR TOKEN
  // =====================================================

  /*
    Verifica si el token sigue siendo válido.

    Envía:
    Authorization: Bearer TOKEN
  */
  autorizar() {

    return this.http.post<any>(
      `${this.apiUrl}/autorizar`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${this.obtenerToken()}`,
        },
      },
    );
  }

  // =====================================================
  // REFRESCAR TOKEN
  // =====================================================

  /*
    Solicita un nuevo token JWT
    antes de que expire.
  */
  refrescarToken() {

    return this.http.post<any>(
      `${this.apiUrl}/refrescar`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${this.obtenerToken()}`,
        },
      },
    );
  }

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  /*
    Elimina usuario y token del navegador.
  */
  cerrarSesion() {

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
}