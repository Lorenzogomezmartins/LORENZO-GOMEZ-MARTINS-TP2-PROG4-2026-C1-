import { CommonModule } from '@angular/common'; // Módulo común de Angular: habilita directivas como *ngIf y *ngFor
import { Component, OnDestroy, OnInit } from '@angular/core'; // Component define el componente, OnInit y OnDestroy son ciclos de vida
import { Router, RouterOutlet } from '@angular/router'; // Router permite navegar entre rutas y RouterOutlet muestra el componente de la ruta actual

import { Navbar } from './components/navbar/navbar'; // Componente de la barra de navegación
import { AuthService } from './services/auth'; // Servicio de autenticación del frontend

// Define el componente principal de la aplicación
@Component({
  selector: 'app-root', // Nombre de la etiqueta HTML principal: <app-root>
  imports: [CommonModule, RouterOutlet, Navbar], // Módulos/componentes que usa este componente standalone
  templateUrl: './app.html', // Archivo HTML asociado
  styleUrl: './app.scss', // Archivo SCSS asociado
})
export class App implements OnInit, OnDestroy {
  // Temporizador que muestra el aviso para extender sesión
  private temporizadorAviso: any;

  // Temporizador que cierra la sesión cuando vence el token
  private temporizadorVencimiento: any;

  // Controla si el modal de sesión aparece o no en pantalla
  modalSesionVisible = false;

  // Inyección de dependencias
  constructor(
    private authService: AuthService, // Servicio para manejar login, token y cierre de sesión
    private router: Router, // Servicio para redirigir entre páginas
  ) {}

  // Se ejecuta cuando el componente principal se inicializa
  ngOnInit(): void {
    // Escucha un evento global para iniciar el contador de sesión
    // Esto sirve, por ejemplo, después de hacer login
    window.addEventListener(
      'iniciar-contador-sesion',
      this.iniciarContadorDesdeEvento,
    );

    // Si ya hay un usuario logueado al abrir la app, inicia el contador de sesión
    if (this.authService.estaLogueado()) {
      this.iniciarContadorSesion();
    }
  }

  // Función que se ejecuta cuando se dispara el evento global
  private iniciarContadorDesdeEvento = () => {
    // Reinicia el contador de sesión
    this.iniciarContadorSesion();
  };

  // Inicia o reinicia los temporizadores relacionados al vencimiento del token
  iniciarContadorSesion() {
    // Limpia temporizadores anteriores para evitar duplicados
    clearTimeout(this.temporizadorAviso);
    clearTimeout(this.temporizadorVencimiento);

    // Obtiene el token guardado en el frontend
    const token = this.authService.obtenerToken();

    // Si no hay token, no se puede calcular vencimiento
    if (!token) {
      return;
    }

    // Decodifica el payload del JWT
    // token.split('.')[1] obtiene la parte central del token
    // atob() decodifica Base64
    // JSON.parse() convierte el texto en objeto
    const payload = JSON.parse(atob(token.split('.')[1]));

    // El campo exp del JWT viene en segundos, por eso se multiplica por 1000 para pasarlo a milisegundos
    const vencimientoMs = payload.exp * 1000;

    // Obtiene la fecha/hora actual en milisegundos
    const ahoraMs = Date.now();

    // Calcula cuánto tiempo falta para que venza el token
    const tiempoRestanteMs = vencimientoMs - ahoraMs;

    // Si el token ya venció, cierra sesión y redirige al login
    if (tiempoRestanteMs <= 0) {
      this.authService.cerrarSesion();
      this.router.navigate(['/login']);
      return;
    }

    // Calcula la mitad del tiempo restante
    // En ese momento se muestra el modal preguntando si quiere extender sesión
    const mitadDelTiempoMs = tiempoRestanteMs / 2;

    // Programa el aviso de extensión de sesión para la mitad del tiempo restante
    this.temporizadorAviso = setTimeout(() => {
      this.modalSesionVisible = true;
    }, mitadDelTiempoMs);

    // Programa el cierre automático de sesión cuando el token venza
    this.temporizadorVencimiento = setTimeout(() => {
      this.authService.cerrarSesion(); // Borra usuario/token guardados
      this.modalSesionVisible = false; // Oculta el modal si estaba abierto
      this.router.navigate(['/login']); // Redirige al login
    }, tiempoRestanteMs);
  }

  // Se ejecuta cuando el usuario acepta extender la sesión
  extenderSesion() {
    // Limpia temporizadores actuales antes de pedir un nuevo token
    clearTimeout(this.temporizadorAviso);
    clearTimeout(this.temporizadorVencimiento);

    // Llama al backend para refrescar el token actual
    this.authService.refrescarToken().subscribe({
      // Si el backend responde correctamente
      next: (resp: any) => {
        // Guarda nuevamente el usuario y el nuevo token
        this.authService.guardarSesion(resp.usuario, resp.token);

        // Oculta el modal
        this.modalSesionVisible = false;

        // Reinicia el contador usando el nuevo token
        this.iniciarContadorSesion();
      },

      // Si el token no se puede refrescar, se cierra sesión
      error: () => {
        this.authService.cerrarSesion();
        this.modalSesionVisible = false;
        this.router.navigate(['/login']);
      },
    });
  }

  // Se ejecuta cuando el usuario decide no extender la sesión
  noExtenderSesion() {
    // Solo oculta el modal
    // La sesión seguirá activa hasta que venza el token
    this.modalSesionVisible = false;
  }

  // Se ejecuta cuando el componente se destruye
  ngOnDestroy(): void {
    // Limpia temporizadores para evitar procesos innecesarios en memoria
    clearTimeout(this.temporizadorAviso);
    clearTimeout(this.temporizadorVencimiento);

    // Elimina el listener global para evitar fugas de memoria
    window.removeEventListener(
      'iniciar-contador-sesion',
      this.iniciarContadorDesdeEvento,
    );
  }
}