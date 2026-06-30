import { Pipe, PipeTransform } from '@angular/core'; // Permite crear pipes personalizados en Angular

// Define un pipe personalizado llamado perfilTexto
@Pipe({
  name: 'perfilTexto', // Nombre que se utilizará en el HTML
  standalone: true, // Permite usarlo sin declararlo en un módulo
})
export class PerfilTextoPipe implements PipeTransform {

  // Método que transforma el valor recibido
  transform(perfil: string): string {

    // Si el perfil es administrador devuelve "Administrador"
    // En cualquier otro caso devuelve "Usuario"
    return perfil === 'administrador'
      ? 'Administrador'
      : 'Usuario';
  }
}