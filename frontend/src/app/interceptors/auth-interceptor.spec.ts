import { TestBed } from '@angular/core/testing'; // Herramientas para realizar pruebas unitarias en Angular
import { HttpInterceptorFn } from '@angular/common/http'; // Tipo de interceptor funcional

import { authInterceptor } from './auth-interceptor'; // Interceptor que se va a probar

describe('authInterceptor', () => {

  // Crea una instancia del interceptor dentro del contexto
  // de inyección de dependencias de Angular
  const interceptor: HttpInterceptorFn = (
    req,
    next,
  ) =>
    TestBed.runInInjectionContext(() =>
      authInterceptor(req, next),
    );

  // Se ejecuta antes de cada prueba
  beforeEach(() => {

    // Configura el entorno de pruebas
    TestBed.configureTestingModule({});
  });

  // Caso de prueba
  it('should be created', () => {

    // Verifica que el interceptor exista
    expect(interceptor).toBeTruthy();
  });
});