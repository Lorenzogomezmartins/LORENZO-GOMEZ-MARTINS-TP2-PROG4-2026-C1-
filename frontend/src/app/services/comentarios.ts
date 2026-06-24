import { HttpClient } from '@angular/common/http'; // Servicio de Angular para realizar peticiones HTTP
import { Injectable } from '@angular/core'; // Permite que el servicio pueda ser inyectado en componentes y otros servicios

// Hace que este servicio esté disponible en toda la aplicación
@Injectable({
  providedIn: 'root',
})
export class ComentariosService {

  // URL base del módulo de comentarios en el backend
  private apiUrl = 'http://localhost:3000/publicaciones';

  // Inyección de dependencias de HttpClient
  constructor(private http: HttpClient) {}

  // =====================================================
  // LISTAR COMENTARIOS DE UNA PUBLICACIÓN
  // =====================================================

  listarComentarios(
    publicacionId: string,
    offset = 0,
    limit = 5,
  ) {

    // Realiza una petición GET al backend
    // offset y limit permiten implementar paginación ("cargar más")
    return this.http.get(
      `${this.apiUrl}/${publicacionId}/comentarios?offset=${offset}&limit=${limit}`,
    );
  }

  // =====================================================
  // CREAR COMENTARIO
  // =====================================================

  crearComentario(
    publicacionId: string,
    datos: any,
  ) {

    // Envía un comentario nuevo al backend
    // Utiliza POST porque está creando un recurso
    return this.http.post(
      `${this.apiUrl}/${publicacionId}/comentarios`,
      datos,
    );
  }

  // =====================================================
  // EDITAR COMENTARIO
  // =====================================================

  editarComentario(
    comentarioId: string,
    datos: any,
  ) {

    // Envía una actualización de un comentario existente
    // Utiliza PUT porque modifica un recurso ya creado
    return this.http.put(
      `${this.apiUrl}/comentarios/${comentarioId}`,
      datos,
    );
  }

  // =====================================================
  // LISTAR COMENTARIOS DE UN USUARIO
  // =====================================================

  listarComentariosDeUsuario(usuarioId: string) {

    // Obtiene los últimos comentarios realizados por un usuario específico
    return this.http.get(
      `${this.apiUrl}/comentarios/usuario/${usuarioId}`,
    );
  }
}