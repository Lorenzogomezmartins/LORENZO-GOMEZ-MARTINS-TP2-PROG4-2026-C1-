import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  if (usuario?.perfil === 'administrador') {
    return true;
  }

  router.navigate(['/publicaciones']);
  return false;
};