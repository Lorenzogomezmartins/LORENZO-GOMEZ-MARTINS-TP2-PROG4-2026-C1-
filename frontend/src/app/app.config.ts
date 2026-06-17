import {
  ApplicationConfig, // Tipo utilizado para definir la configuración global de Angular
  provideBrowserGlobalErrorListeners, // Maneja errores globales de la aplicación
  provideZoneChangeDetection, // Configura cómo Angular detecta cambios en la interfaz
} from '@angular/core';

import { provideRouter } from '@angular/router'; // Habilita el sistema de rutas de Angular
import { provideHttpClient } from '@angular/common/http'; // Habilita HttpClient para hacer peticiones HTTP

import { routes } from './app.routes'; // Importa las rutas definidas en app.routes.ts

// Configuración principal de la aplicación Angular
export const appConfig: ApplicationConfig = {
  providers: [

    // Manejo global de errores
    provideBrowserGlobalErrorListeners(),

    // Optimiza la detección de cambios de Angular
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    // Registra las rutas de la aplicación
    provideRouter(routes),

    // Habilita HttpClient para consumir APIs
    provideHttpClient(),
  ],
};