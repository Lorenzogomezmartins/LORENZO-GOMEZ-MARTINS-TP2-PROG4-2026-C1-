// Necesario para que Angular detecte cambios y actualice la vista automáticamente.
import 'zone.js';

// Función que inicia la aplicación Angular.
import { bootstrapApplication } from '@angular/platform-browser';

// Configuración global de la aplicación.
import { appConfig } from './app/app.config';

// Componente principal de la aplicación.
import { App } from './app/app';

// Inicia Angular usando App como componente raíz y appConfig como configuración.
bootstrapApplication(App, appConfig)
  // Muestra cualquier error ocurrido durante el arranque.
  .catch((err) => console.error(err));