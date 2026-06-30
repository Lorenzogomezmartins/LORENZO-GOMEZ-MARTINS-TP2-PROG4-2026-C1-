import { HttpClient, HttpHeaders } from '@angular/common/http'; // Permite realizar peticiones HTTP y configurar headers
import { Injectable } from '@angular/core'; // Permite inyectar el servicio

// Tipo de dato para la respuesta de publicaciones por usuario
interface PublicacionesPorUsuario {
  usuario: string;
  cantidad: number;
}

// Tipo de dato para la respuesta del total de comentarios
interface ComentariosTotal {
  cantidad: number;
}

// Tipo de dato para la respuesta de comentarios por publicación
interface ComentariosPorPublicacion {
  publicacion: string;
  cantidad: number;
}

// Hace que el servicio esté disponible en toda la aplicación
@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {

  // URL base del módulo estadísticas del backend
  private apiUrl = 'https://redsocial-backend-fy2b.onrender.com/estadisticas';

  // Inyección de HttpClient
  constructor(private http: HttpClient) {}

  // =====================================================
  // HEADERS CON TOKEN
  // =====================================================

  /*
    Obtiene el token JWT almacenado en localStorage
    para enviarlo al backend.
  */
  private obtenerHeaders() {

    const token =
      localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // =====================================================
  // PUBLICACIONES POR USUARIO
  // =====================================================

  /*
    GET /estadisticas/publicaciones-por-usuario
  */
  publicacionesPorUsuario(
    desde: string,
    hasta: string,
  ) {

    return this.http.get<
      PublicacionesPorUsuario[]
    >(
      `${this.apiUrl}/publicaciones-por-usuario?desde=${desde}&hasta=${hasta}`,
      this.obtenerHeaders(),
    );
  }

  // =====================================================
  // TOTAL DE COMENTARIOS
  // =====================================================

  /*
    GET /estadisticas/comentarios-total
  */
  comentariosTotal(
    desde: string,
    hasta: string,
  ) {

    return this.http.get<
      ComentariosTotal
    >(
      `${this.apiUrl}/comentarios-total?desde=${desde}&hasta=${hasta}`,
      this.obtenerHeaders(),
    );
  }

  // =====================================================
  // COMENTARIOS POR PUBLICACIÓN
  // =====================================================

  /*
    GET /estadisticas/comentarios-por-publicacion
  */
  comentariosPorPublicacion(
    desde: string,
    hasta: string,
  ) {

    return this.http.get<
      ComentariosPorPublicacion[]
    >(
      `${this.apiUrl}/comentarios-por-publicacion?desde=${desde}&hasta=${hasta}`,
      this.obtenerHeaders(),
    );
  }
}