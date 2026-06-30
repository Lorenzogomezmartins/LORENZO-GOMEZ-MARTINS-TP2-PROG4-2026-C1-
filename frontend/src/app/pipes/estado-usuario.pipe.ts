import { Pipe, PipeTransform } from '@angular/core'; // Permite crear pipes personalizados en Angular

// Define un pipe personalizado llamado estadoUsuario
@Pipe({
  name: 'estadoUsuario', // Nombre que se utilizará en el HTML
  standalone: true, // Permite usarlo sin declararlo en un módulo
})
export class EstadoUsuarioPipe implements PipeTransform {

  // Método que transforma un valor booleano
  transform(activo: boolean): string {

    // Si activo es true devuelve "Habilitado"
    // Si activo es false devuelve "Deshabilitado"
    return activo
      ? 'Habilitado'
      : 'Deshabilitado';
  }
}