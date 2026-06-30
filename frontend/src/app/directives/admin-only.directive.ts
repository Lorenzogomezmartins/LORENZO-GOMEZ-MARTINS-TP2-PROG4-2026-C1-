import {
  Directive, // Permite crear directivas personalizadas
  ElementRef, // Permite acceder al elemento HTML
  OnInit, // Permite ejecutar código al iniciar la directiva
} from '@angular/core';

// Define una directiva personalizada
@Directive({
  selector: '[appAdminOnly]', // Se utiliza como atributo HTML
  standalone: true, // Permite usarla sin declararla en un módulo
})
export class AdminOnlyDirective implements OnInit {

  // Permite acceder al elemento HTML donde se aplica la directiva
  constructor(private el: ElementRef) {}

  // Se ejecuta cuando la directiva se inicializa
  ngOnInit(): void {

    // Obtiene el usuario guardado en localStorage
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || 'null',
    );

    // Si el usuario no es administrador
    if (usuario?.perfil !== 'administrador') {

      // Oculta completamente el elemento HTML
      this.el.nativeElement.style.display = 'none';
    }
  }
}