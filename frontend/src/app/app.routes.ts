// Tipo utilizado por Angular para definir las rutas de la aplicación.
import { Routes } from '@angular/router';

// Componentes asociados a cada página.
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';

// Definición de las rutas de la aplicación.
export const routes: Routes = [
  {
    // Ruta inicial de la aplicación.
    path: '',

    // Redirige automáticamente al login.
    redirectTo: 'login',

    // La ruta debe coincidir exactamente con ''.
    pathMatch: 'full',
  },
  {
    // Ruta para la pantalla de inicio de sesión.
    path: 'login',
    component: Login,
  },
  {
    // Ruta para la pantalla de registro.
    path: 'registro',
    component: Registro,
  },
  {
    // Ruta para visualizar publicaciones.
    path: 'publicaciones',
    component: Publicaciones,
  },
  {
    // Ruta para visualizar el perfil del usuario.
    path: 'mi-perfil',
    component: MiPerfil,
  },
  {
    // Captura cualquier ruta inexistente.
    path: '**',

    // Redirige al login si la URL no existe.
    redirectTo: 'login',
  },
];