import {
  Directive, // Permite crear directivas personalizadas
  ElementRef, // Permite acceder al elemento HTML
  Input, // Permite recibir datos desde el HTML
  OnChanges, // Detecta cambios en los inputs
} from '@angular/core';

// Define una directiva personalizada
@Directive({
  selector: '[appResaltarAdmin]', // Se usa como atributo HTML
  standalone: true, // Permite usarla sin declararla en un módulo
})
export class ResaltarAdminDirective implements OnChanges {

  // Recibe el perfil del usuario desde el componente
  @Input() perfil = '';

  // Permite acceder al elemento HTML donde se aplica la directiva
  constructor(private el: ElementRef) {}

  // Se ejecuta cada vez que cambia el valor de perfil
  ngOnChanges(): void {

    // Si el usuario es administrador
    if (this.perfil === 'administrador') {

      // Aplica texto en negrita
      this.el.nativeElement.style.fontWeight = 'bold';

      // Aplica color azul
      this.el.nativeElement.style.color = '#2563eb';
    }
  }
}