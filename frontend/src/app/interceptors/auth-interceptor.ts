import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const request = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(request).pipe(
    tap({
      error: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
      },
    }),
  );
};

import { tap } from 'rxjs';