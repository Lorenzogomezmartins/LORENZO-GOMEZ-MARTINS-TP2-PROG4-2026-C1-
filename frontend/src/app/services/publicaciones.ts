import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  private apiUrl = 'http://localhost:3000/publicaciones';

  constructor(private http: HttpClient) {}

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

  crearPublicacion(formData: FormData) {
    return this.http.post(this.apiUrl, formData);
  }

  darLike(publicacionId: string, usuarioId: string) {
    return this.http.post(`${this.apiUrl}/${publicacionId}/like`, {
      usuarioId,
    });
  }

  quitarLike(publicacionId: string, usuarioId: string) {
    return this.http.delete(`${this.apiUrl}/${publicacionId}/like`, {
      body: { usuarioId },
    });
  }

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