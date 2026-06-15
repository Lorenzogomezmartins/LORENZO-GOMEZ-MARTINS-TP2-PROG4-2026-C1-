// Herramientas de Angular para realizar pruebas unitarias.
import { TestBed } from '@angular/core/testing';

// Servicio que será probado.
import { Auth } from './auth';

describe('Auth', () => {

  // Variable donde se almacenará la instancia del servicio.
  let service: Auth;

  beforeEach(() => {

    // Configura el entorno de pruebas antes de cada test.
    TestBed.configureTestingModule({});

    // Obtiene una instancia del servicio desde el sistema de inyección de dependencias.
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {

    // Verifica que el servicio haya sido creado correctamente.
    expect(service).toBeTruthy();
  });
});