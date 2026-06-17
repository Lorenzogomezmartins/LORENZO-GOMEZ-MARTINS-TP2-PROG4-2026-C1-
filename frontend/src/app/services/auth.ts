import { HttpClient, HttpHeaders } from '@angular/common/http'; // Servicios para realizar peticiones HTTP y enviar headers personalizados
import { Injectable } from '@angular/core'; // Permite que este servicio pueda ser inyectado en toda la aplicación

// Hace que el servicio esté disponible globalmente
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // URL base del módulo de autenticación del backend
  private apiUrl = 'http://localhost:3000/auth';

  // Inyección de dependencias de HttpClient
  constructor(private http: HttpClient) {}

  // =====================================================
  // REGISTRO
  // =====================================================

  registrar(datos: FormData) {

    // Envía los datos del formulario de registro al backend
    // Se utiliza FormData porque incluye texto e imagen de perfil
    return this.http.post(
      `${this.apiUrl}/registro`,
      datos,
    );
  }

  // =====================================================
  // LOGIN
  // =====================================================

  login(
    credenciales: {
      identificador: string;
      password: string;
    },
  ) {

    // Envía correo/nombreUsuario y contraseña al backend
    return this.http.post(
      `${this.apiUrl}/login`,
      credenciales,
    );
  }

  // =====================================================
  // VALIDAR TOKEN
  // =====================================================

  autorizar() {

    // Obtiene el token almacenado localmente
    const token = this.obtenerToken();

    // Crea el header Authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Envía el token al backend para validar si sigue siendo válido
    return this.http.post(
      `${this.apiUrl}/autorizar`,
      {},
      { headers },
    );
  }

  // =====================================================
  // REFRESCAR TOKEN
  // =====================================================

  refrescarToken() {

    // Obtiene el token actual
    const token = this.obtenerToken();

    // Agrega el token al header Authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Solicita al backend un nuevo token antes de que expire
    return this.http.post(
      `${this.apiUrl}/refrescar`,
      {},
      { headers },
    );
  }

  // =====================================================
  // GUARDAR SESIÓN COMPLETA
  // =====================================================

  guardarSesion(usuario: any, token: string) {

    // Guarda el usuario en localStorage
    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario),
    );

    // Guarda el token JWT en localStorage
    localStorage.setItem(
      'token',
      token,
    );
  }

  // =====================================================
  // GUARDAR SOLO USUARIO
  // =====================================================

  guardarUsuario(usuario: any) {

    // Actualiza únicamente la información del usuario
    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario),
    );
  }

  // =====================================================
  // GUARDAR SOLO TOKEN
  // =====================================================

  guardarToken(token: string) {

    // Actualiza únicamente el token
    localStorage.setItem(
      'token',
      token,
    );
  }

  // =====================================================
  // OBTENER USUARIO
  // =====================================================

  obtenerUsuario() {

    // Busca el usuario almacenado localmente
    const usuario = localStorage.getItem('usuario');

    // Si existe, lo convierte de JSON a objeto
    // Si no existe, devuelve null
    return usuario ? JSON.parse(usuario) : null;
  }

  // =====================================================
  // OBTENER TOKEN
  // =====================================================

  obtenerToken() {

    // Devuelve el token almacenado
    // Si no existe devuelve string vacío
    return localStorage.getItem('token') || '';
  }

  // =====================================================
  // VERIFICAR SI HAY SESIÓN ACTIVA
  // =====================================================

  estaLogueado(): boolean {

    // Verifica que exista usuario y token
    return (
      !!this.obtenerToken() &&
      !!this.obtenerUsuario()
    );
  }

  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  cerrarSesion() {

    // Elimina los datos almacenados localmente
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
}