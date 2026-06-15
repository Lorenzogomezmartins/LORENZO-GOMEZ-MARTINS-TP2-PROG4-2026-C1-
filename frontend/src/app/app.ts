// Decorador para definir un componente de Angular.
import { Component } from '@angular/core';

// Permite mostrar los componentes asociados a las rutas.
import { RouterOutlet } from '@angular/router';

// Componente de navegación de la aplicación.
import { Navbar } from './components/navbar/navbar';

// Configuración del componente principal de la aplicación.
@Component({
  // Nombre de la etiqueta HTML que representa este componente.
  selector: 'app-root',

  // Componentes y directivas que utilizará este componente.
  imports: [RouterOutlet, Navbar],

  // Archivo HTML asociado al componente.
  templateUrl: './app.html',

  // Archivo de estilos asociado al componente.
  styleUrl: './app.scss',
})

// Componente raíz desde donde se renderiza toda la aplicación.
export class App {}