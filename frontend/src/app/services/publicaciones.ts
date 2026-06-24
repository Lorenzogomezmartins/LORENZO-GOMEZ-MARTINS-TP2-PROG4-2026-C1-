// Servicio para realizar operaciones relacionadas con publicaciones.
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Permite que Angular pueda inyectar este servicio donde sea necesario.
import { Injectable } from '@angular/core';

@Injectable({
  // Hace que el servicio esté disponible en toda la aplicación.
  providedIn: 'root',
})
export class PublicacionesService {
  private apiUrl =
    'https://redsocial-backend-fy2b.onrender.com/publicaciones';

  // Inyección de HttpClient para realizar peticiones HTTP.
  constructor(private http: HttpClient) {}

  // Obtiene publicaciones con paginación, ordenamiento y filtro opcional por usuario.
  listarPublicaciones(
    orden = 'fecha',
    offset = 0,
    limit = 5,
    usuarioId?: string,
  ) {
    let url = `${this.apiUrl}?orden=${orden}&offset=${offset}&limit=${limit}`;

    if (usuarioId) {
      url += `&usuarioId=${usuarioId}`;
    }

    return this.http.get(url);
  }

  // Obtiene una publicación por ID.
  obtenerPublicacionPorId(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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
    const headers = new HttpHeaders({
      'usuario-id': usuarioId,
      'usuario-perfil': perfil,
    });

    return this.http.delete(`${this.apiUrl}/${publicacionId}`, {
      headers,
    });
  }
}