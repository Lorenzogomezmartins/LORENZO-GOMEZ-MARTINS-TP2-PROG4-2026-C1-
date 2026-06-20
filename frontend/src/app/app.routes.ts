// Tipo utilizado por Angular para definir las rutas de la aplicación.
import { Routes } from '@angular/router';

// Componentes asociados a cada página.
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { DashboardUsuarios } from './pages/dashboard-usuarios/dashboard-usuarios';
import { DashboardEstadisticas } from './pages/dashboard-estadisticas/dashboard-estadisticas';

// Guard propio para permitir acceso solo a administradores.
import { adminGuard } from './guards/admin.guard';

// Definición de las rutas de la aplicación.
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'registro',
    component: Registro,
  },
  {
    path: 'publicaciones',
    component: Publicaciones,
  },
  {
    path: 'mi-perfil',
    component: MiPerfil,
  },
  {
    path: 'dashboard/usuarios',
    component: DashboardUsuarios,
    canActivate: [adminGuard],
  },
  {
    path: 'dashboard/estadisticas',
    component: DashboardEstadisticas,
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];