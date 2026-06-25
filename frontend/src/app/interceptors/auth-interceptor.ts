import { HttpInterceptorFn } from '@angular/common/http'; // Permite interceptar todas las peticiones HTTP
import { inject } from '@angular/core'; // Permite inyectar dependencias fuera de clases
import { Router } from '@angular/router'; // Permite navegar entre rutas

import { tap } from 'rxjs'; // Permite reaccionar ante respuestas o errores de las peticiones

// Interceptor que agrega automáticamente el token JWT
// y controla errores de autenticación
export const authInterceptor: HttpInterceptorFn = (
  req,
  next,
) => {

  // Obtiene el Router mediante inyección
  const router = inject(Router);

  // Obtiene el token almacenado en localStorage
  const token =
    localStorage.getItem('token');

  // Si existe token, clona la petición y agrega
  // el header Authorization
  const request = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Continúa la petición
  return next(request).pipe(

    // Escucha posibles errores de la respuesta
    tap({
      error: (error) => {

        // Si el backend responde 401 (Unauthorized)
        if (error.status === 401) {

          // Elimina la sesión local
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');

          // Redirige al login
          router.navigate(['/login']);
        }
      },
    }),
  );
};