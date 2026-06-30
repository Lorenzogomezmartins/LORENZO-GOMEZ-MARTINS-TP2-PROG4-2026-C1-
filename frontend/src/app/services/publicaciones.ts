import { HttpClient, HttpHeaders } from '@angular/common/http'; // Permite realizar peticiones HTTP y configurar headers
import { Injectable } from '@angular/core'; // Permite inyectar este servicio en cualquier componente

// Hace que el servicio esté disponible en toda la aplicación
@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {

  // URL base del módulo publicaciones del backend
  private apiUrl = 'https://redsocial-backend-fy2b.onrender.com/publicaciones';

  // Inyección de HttpClient
  constructor(private http: HttpClient) {}

  // =====================================================
  // LISTAR PUBLICACIONES
  // =====================================================

  /*
    GET /publicaciones

    Permite:
    - ordenar publicaciones
    - paginar resultados
    - filtrar por usuario
  */
  listarPublicaciones(
    orden = 'fecha',
    offset = 0,
    limit = 5,
    usuarioId?: string,
  ) {

    // Construye la URL con filtros y paginación
    let url =
      `${this.apiUrl}?orden=${orden}&offset=${offset}&limit=${limit}`;

    // Si se envía usuarioId filtra publicaciones de ese usuario
    if (usuarioId) {
      url += `&usuarioId=${usuarioId}`;
    }

    return this.http.get(url);
  }

  // =====================================================
  // OBTENER PUBLICACIÓN POR ID
  // =====================================================

  /*
    GET /publicaciones/:id
  */
  obtenerPublicacionPorId(id: string) {

    return this.http.get(
      `${this.apiUrl}/${id}`,
    );
  }

  // =====================================================
  // CREAR PUBLICACIÓN
  // =====================================================

  /*
    POST /publicaciones

    Utiliza FormData porque envía:
    - texto
    - imagen
  */
  crearPublicacion(formData: FormData) {

    return this.http.post(
      this.apiUrl,
      formData,
    );
  }

  // =====================================================
  // DAR LIKE
  // =====================================================

  /*
    POST /publicaciones/:id/like
  */
  darLike(
    publicacionId: string,
    usuarioId: string,
  ) {

    return this.http.post(
      `${this.apiUrl}/${publicacionId}/like`,
      {
        usuarioId,
      },
    );
  }

  // =====================================================
  // QUITAR LIKE
  // =====================================================

  /*
    DELETE /publicaciones/:id/like
  */
  quitarLike(
    publicacionId: string,
    usuarioId: string,
  ) {

    return this.http.delete(
      `${this.apiUrl}/${publicacionId}/like`,
      {
        body: {
          usuarioId,
        },
      },
    );
  }

  // =====================================================
  // ELIMINAR PUBLICACIÓN
  // =====================================================

  /*
    DELETE /publicaciones/:id

    Envía datos del usuario por headers para
    validar permisos en el backend.
  */
  eliminarPublicacion(
    publicacionId: string,
    usuarioId: string,
    perfil: string,
  ) {

    // Crea headers personalizados
    const headers = new HttpHeaders({
      'usuario-id': usuarioId,
      'usuario-perfil': perfil,
    });

    return this.http.delete(
      `${this.apiUrl}/${publicacionId}`,
      {
        headers,
      },
    );
  }
}