import { HttpClient, HttpHeaders } from '@angular/common/http'; // Permite realizar peticiones HTTP y configurar headers
import { Injectable } from '@angular/core'; // Permite inyectar este servicio en cualquier componente

// Hace que el servicio esté disponible en toda la aplicación
@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  // URL base del módulo usuarios del backend
  private apiUrl = 'http://localhost:3000/usuarios';

  // Inyección de HttpClient
  constructor(private http: HttpClient) {}

  // =====================================================
  // HEADERS CON TOKEN
  // =====================================================

  /*
    Obtiene el token guardado en localStorage
    y lo envía en el header Authorization.
  */
  private obtenerHeaders() {

    const token =
      localStorage.getItem('token') || '';

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // =====================================================
  // LISTAR USUARIOS
  // =====================================================

  /*
    GET /usuarios
  */
  listarUsuarios() {

    return this.http.get<any[]>(
      this.apiUrl,
      this.obtenerHeaders(),
    );
  }

  // =====================================================
  // CREAR USUARIO
  // =====================================================

  /*
    POST /usuarios
  */
  crearUsuario(usuario: any) {

    return this.http.post(
      this.apiUrl,
      usuario,
      this.obtenerHeaders(),
    );
  }

  // =====================================================
  // DESHABILITAR USUARIO
  // =====================================================

  /*
    DELETE /usuarios/:id
  */
  deshabilitarUsuario(id: string) {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.obtenerHeaders(),
    );
  }

  // =====================================================
  // HABILITAR USUARIO
  // =====================================================

  /*
    POST /usuarios/:id/habilitar
  */
  habilitarUsuario(id: string) {

    return this.http.post(
      `${this.apiUrl}/${id}/habilitar`,
      {},
      this.obtenerHeaders(),
    );
  }
}