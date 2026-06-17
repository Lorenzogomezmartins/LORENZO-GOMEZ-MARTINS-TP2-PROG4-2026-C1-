import { Routes } from '@angular/router'; // Tipo utilizado para definir las rutas de Angular

import { Login } from './pages/login/login'; // Componente de la página Login
import { Registro } from './pages/registro/registro'; // Componente de la página Registro
import { Publicaciones } from './pages/publicaciones/publicaciones'; // Componente de la página Publicaciones
import { MiPerfil } from './pages/mi-perfil/mi-perfil'; // Componente de la página Mi Perfil

// Define todas las rutas de la aplicación
export const routes: Routes = [

  // =====================================================
  // RUTA INICIAL
  // =====================================================

  {
    path: '', // Cuando la URL está vacía
    redirectTo: 'login', // Redirige automáticamente al login
    pathMatch: 'full',
  },

  // =====================================================
  // LOGIN
  // =====================================================

  {
    path: 'login',
    component: Login,
  },

  // =====================================================
  // REGISTRO
  // =====================================================

  {
    path: 'registro',
    component: Registro,
  },

  // =====================================================
  // PUBLICACIONES
  // =====================================================

  {
    path: 'publicaciones',
    component: Publicaciones,
  },

  // =====================================================
  // MI PERFIL
  // =====================================================

  {
    path: 'mi-perfil',
    component: MiPerfil,
  },

  // =====================================================
  // RUTA NO EXISTENTE
  // =====================================================

  {
    path: '**', // Captura cualquier URL que no exista
    redirectTo: 'login', // Redirige al login
  },
];