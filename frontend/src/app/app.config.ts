// Tipos y configuraciones globales utilizadas por Angular.
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

// Permite registrar las rutas de la aplicación.
import { provideRouter } from '@angular/router';

// Permite realizar peticiones HTTP desde Angular.
import { provideHttpClient } from '@angular/common/http';

// Importa las rutas definidas en app.routes.ts.
import { routes } from './app.routes';

// Configuración global de la aplicación.
export const appConfig: ApplicationConfig = {
  providers: [
    // Captura errores globales del navegador y de Angular.
    provideBrowserGlobalErrorListeners(),

    // Configura la detección de cambios de Angular para optimizar rendimiento.
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Registra todas las rutas de la aplicación.
    provideRouter(routes),

    // Habilita HttpClient para consumir APIs y servicios externos.
    provideHttpClient(),

    provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode(),
  registrationStrategy: 'registerWhenStable:30000',
}),
  ],

  
};