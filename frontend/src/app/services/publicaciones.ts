// Servicio para realizar operaciones relacionadas con publicaciones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Permite que Angular pueda inyectar este servicio donde sea necesario.
import { Injectable } from '@angular/core';

@Injectable({
  // Hace que el servicio esté disponible en toda la aplicación.
  providedIn: 'root',
})
export class PublicacionesService {

  // URL base del módulo de publicaciones del backend.
  private apiUrl = 'http://localhost:3000/publicaciones';

  // Inyección de HttpClient para realizar peticiones HTTP.
  constructor(private http: HttpClient) {}

  // Obtiene publicaciones con paginación, ordenamiento y filtro opcional por usuario.
  listarPublicaciones(
    orden = 'fecha',
    offset = 0,
    limit = 5,
    usuarioId?: string,
  ) {
    // Construye la URL con parámetros de consulta.
    let url = `${this.apiUrl}?orden=${orden}&offset=${offset}&limit=${limit}`;

    // Si se recibe un usuarioId, agrega el filtro a la URL.
    if (usuarioId) {
      url += `&usuarioId=${usuarioId}`;
    }

    // Realiza una petición GET para obtener las publicaciones.
    return this.http.get(url);
  }

  // Crea una nueva publicación.
  crearPublicacion(formData: FormData) {
    return this.http.post(this.apiUrl, formData);
  }

  // Agrega un like a una publicación.
  darLike(publicacionId: string, usuarioId: string) {
    return this.http.post(`${this.apiUrl}/${publicacionId}/like`, {
      usuarioId,
    });
  }

  // Elimina un like de una publicación.
  quitarLike(publicacionId: string, usuarioId: string) {
    return this.http.delete(`${this.apiUrl}/${publicacionId}/like`, {
      body: { usuarioId },
    });
  }

  // Elimina una publicación enviando los datos del usuario en los headers.
  eliminarPublicacion(
    publicacionId: string,
    usuarioId: string,
    perfil: string,
  ) {
    // Crea los headers necesarios para validar permisos en el backend.
    const headers = new HttpHeaders({
      'usuario-id': usuarioId,
      'usuario-perfil': perfil,
    });

    // Realiza la petición DELETE.
    return this.http.delete(`${this.apiUrl}/${publicacionId}`, {
      headers,   
    });  
  }
  // Obtiene una publicación específica por su ID.
obtenerPublicacionPorId(id: string) {
  return this.http.get(`${this.apiUrl}/${id}`);
}
}