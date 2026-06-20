import {
  Directive, // Permite crear directivas personalizadas
  ElementRef, // Permite acceder al elemento HTML
  Input, // Permite recibir datos desde el componente
  OnChanges, // Detecta cambios en los inputs
} from '@angular/core';

// Define una directiva personalizada
@Directive({
  selector: '[appDeshabilitadoOpaco]', // Se utiliza como atributo HTML
  standalone: true, // Permite usarla sin declararla en un módulo
})
export class DeshabilitadoOpacoDirective implements OnChanges {

  // Recibe el estado del usuario
  @Input() activo = true;

  // Permite acceder al elemento HTML
  constructor(private el: ElementRef) {}

  // Se ejecuta cuando cambia el valor de activo
  ngOnChanges(): void {

    // Si activo = true → opacidad normal
    // Si activo = false → opacidad reducida
    this.el.nativeElement.style.opacity =
      this.activo ? '1' : '0.45';
  }
}