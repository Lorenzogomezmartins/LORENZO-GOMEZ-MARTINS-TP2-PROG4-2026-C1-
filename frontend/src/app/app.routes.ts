import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { PublicacionDetalle } from './pages/publicacion-detalle/publicacion-detalle';
import { Cargando } from './components/cargando/cargando';

export const routes: Routes = [
  {
    path: '',
    component: Cargando,
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
    path: 'publicacion/:id',
    component: PublicacionDetalle,
  },
  {
    path: 'mi-perfil',
    component: MiPerfil,
  },
  {
    path: '**',
    redirectTo: '',
  },
];