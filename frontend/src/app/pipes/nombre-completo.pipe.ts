import { Pipe, PipeTransform } from '@angular/core'; // Permite crear pipes personalizados en Angular

// Define un pipe personalizado llamado nombreCompleto
@Pipe({
  name: 'nombreCompleto', // Nombre que se utilizará en el HTML
  standalone: true, // Permite usarlo sin declararlo en un módulo
})
export class NombreCompletoPipe implements PipeTransform {

  // Método que transforma el objeto usuario recibido
  transform(usuario: any): string {

    // Une nombre y apellido en un único texto
    return `${usuario.nombre} ${usuario.apellido}`;
  }
}