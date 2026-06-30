import { CommonModule } from '@angular/common'; // Importa directivas comunes como *ngIf, *ngFor, etc.
import { RouterLink, RouterLinkActive } from '@angular/router'; // Permite usar links de navegación y marcar rutas activas.

import {
  AfterViewInit, // Interfaz que permite ejecutar lógica después de que la vista HTML ya se cargó.
  Component, // Decorador para declarar un componente Angular.
  ElementRef, // Permite acceder directamente a un elemento del HTML, en este caso un canvas.
  ViewChild, // Permite capturar elementos del template usando una referencia.
} from '@angular/core';

import { FormsModule } from '@angular/forms'; // Permite usar ngModel para vincular inputs del formulario.
import Chart from 'chart.js/auto'; // Importa Chart.js para crear gráficos automáticamente.

import { EstadisticasService } from '../../services/estadisticas.service'; // Servicio que consulta estadísticas al backend.

// Componente del dashboard de estadísticas.
@Component({
  selector: 'app-dashboard-estadisticas', // Nombre de la etiqueta HTML del componente.
  standalone: true, // Indica que el componente no depende de un módulo tradicional.
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    RouterLinkActive,
  ],
  templateUrl: './dashboard-estadisticas.html', 
  styleUrl: './dashboard-estadisticas.scss', 
})
export class DashboardEstadisticas implements AfterViewInit {
  desde = '2025-01-01';
  hasta = '2027-12-31';

  error = '';
  totalComentarios = 0;

  sinDatosPublicaciones = false;

  sinDatosComentariosTotal = false;
  sinDatosComentariosPublicacion = false;

  // Captura el canvas del HTML donde se dibuja el gráfico de publicaciones.
  @ViewChild('graficoPublicaciones')
  graficoPublicaciones!: ElementRef<HTMLCanvasElement>;

  // Captura el canvas del HTML donde se dibuja el gráfico del total de comentarios.
  @ViewChild('graficoComentariosTotal')
  graficoComentariosTotal!: ElementRef<HTMLCanvasElement>;

  // Captura el canvas del HTML donde se dibuja el gráfico de comentarios por publicación.
  @ViewChild('graficoComentariosPublicacion')
  graficoComentariosPublicacion!: ElementRef<HTMLCanvasElement>;

  // Guarda la instancia del gráfico de publicaciones para poder destruirla o actualizarla.
  chartPublicaciones: Chart | null = null;

  // Guarda la instancia del gráfico de comentarios totales.
  chartComentariosTotal: Chart | null = null;

  // Guarda la instancia del gráfico de comentarios por publicación.
  chartComentariosPublicacion: Chart | null = null;

  // Inyecta el servicio que se comunica con el backend para obtener estadísticas.
  constructor(private estadisticasService: EstadisticasService) {}

  // Se ejecuta cuando Angular ya cargó el HTML y los canvas existen.
  ngAfterViewInit(): void {
    this.cargarEstadisticas(); // Carga todas las estadísticas al iniciar la vista.
  }

  // Método general que carga todos los gráficos del dashboard.
  cargarEstadisticas(): void {
    this.error = ''; // Limpia errores anteriores.

    this.cargarPublicacionesPorUsuario(); // Carga el gráfico de publicaciones por usuario.
    this.cargarComentariosTotal(); // Carga el gráfico del total de comentarios.
    this.cargarComentariosPorPublicacion(); // Carga el gráfico de publicaciones con más comentarios.
  }

  // Consulta al backend y grafica cuántas publicaciones hizo cada usuario.
  cargarPublicacionesPorUsuario(): void {
    this.estadisticasService
      .publicacionesPorUsuario(this.desde, this.hasta) // Llama al service pasando el rango de fechas.
      .subscribe({
        next: (data) => { // Se ejecuta si la petición HTTP sale bien.
          this.chartPublicaciones?.destroy(); // Elimina el gráfico anterior para evitar duplicados.

          this.sinDatosPublicaciones = data.length === 0; // Verifica si el backend devolvió un array vacío.

          if (this.sinDatosPublicaciones) {
            return; // Si no hay datos, corta la función y no dibuja el gráfico.
          }

          this.chartPublicaciones = new Chart( // Crea una nueva instancia de gráfico.
            this.graficoPublicaciones.nativeElement, // Usa el canvas capturado del HTML.
            {
              type: 'bar', // Define un gráfico de barras verticales.
              data: {
                labels: data.map((x) => x.usuario), // Nombres del eje X: usuarios.
                datasets: [
                  {
                    label: 'Publicaciones', // Nombre interno del conjunto de datos.
                    data: data.map((x) => x.cantidad), // Valores de las barras: cantidad de publicaciones.
                    borderWidth: 1, // Grosor del borde de cada barra.
                    borderRadius: 8, // Redondea las esquinas de las barras.
                  },
                ],
              },
              options: {
                responsive: true, // Hace que el gráfico se adapte al tamaño del contenedor.
                maintainAspectRatio: false, // Permite controlar el alto desde CSS.
                plugins: {
                  legend: {
                    display: false, // Oculta la leyenda porque hay un solo dato.
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true, // Hace que el eje Y empiece en 0.
                    ticks: {
                      precision: 0, // Muestra solo números enteros, no decimales.
                    },
                  },
                },
              },
            },
          );
        },
        error: () => { // Se ejecuta si falla la petición HTTP.
          this.error = 'No se pudieron cargar las publicaciones por usuario.';
        },
      });
  }

  // Consulta al backend y grafica comentarios por día en un lapso.
cargarComentariosTotal(): void {
  this.estadisticasService
    .comentariosTotal(this.desde, this.hasta)
    .subscribe({
      next: (data: any) => {
        this.chartComentariosTotal?.destroy();

        const comentariosPorDia: any[] = Array.isArray(data) ? data : [];

        this.totalComentarios = comentariosPorDia.reduce(
          (total: number, item: any) => total + item.cantidad,
          0,
        );

        this.sinDatosComentariosTotal = this.totalComentarios === 0;

        if (this.sinDatosComentariosTotal) {
          return;
        }

        this.chartComentariosTotal = new Chart(
          this.graficoComentariosTotal.nativeElement,
          {
            type: 'line',
            data: {
              labels: comentariosPorDia.map((item: any) => item.fecha),
              datasets: [
                {
                  label: 'Comentarios por día',
                  data: comentariosPorDia.map((item: any) => item.cantidad),
                  borderWidth: 2,
                  tension: 0,
                  stepped: true,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Fecha',
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Cantidad de comentarios',
                  },
                  ticks: {
                    precision: 0,
                    stepSize: 1,
                  },
                },
              },
            },
          },
        );
      },
      error: () => {
        this.error = 'No se pudieron cargar los comentarios por día.';
      },
    });
}

  // Consulta al backend y grafica las publicaciones con más comentarios.
  cargarComentariosPorPublicacion(): void {
    this.estadisticasService
      .comentariosPorPublicacion(this.desde, this.hasta) // Llama al service con el rango de fechas.
      .subscribe({
        next: (data) => { // Se ejecuta si el backend responde correctamente.
          this.chartComentariosPublicacion?.destroy(); // Destruye el gráfico anterior para no duplicarlo.

          const topPublicaciones = [...data] // Crea una copia del array original para no modificarlo directamente.
            .sort((a, b) => b.cantidad - a.cantidad) // Ordena de mayor a menor cantidad de comentarios.
            .slice(0, 4); // Toma solo las primeras 4 publicaciones.

          this.sinDatosComentariosPublicacion =
            topPublicaciones.length === 0; // Verifica si no hay publicaciones con comentarios.

          if (this.sinDatosComentariosPublicacion) {
            return; // Si no hay datos, corta la función.
          }

          this.chartComentariosPublicacion = new Chart( // Crea el gráfico.
            this.graficoComentariosPublicacion.nativeElement, // Usa el canvas del HTML.
            {
              type: 'bar', // Gráfico de barras.
              data: {
                labels: topPublicaciones.map((x) => x.publicacion), // Nombres/títulos de publicaciones.
                datasets: [
                  {
                    label: 'Comentarios', // Nombre del dato representado.
                    data: topPublicaciones.map((x) => x.cantidad), // Cantidad de comentarios por publicación.
                    borderWidth: 1, // Grosor del borde.
                    borderRadius: 8, // Bordes redondeados.
                  },
                ],
              },
              options: {
                indexAxis: 'y', // Hace que las barras sean horizontales.
                responsive: true, // Se adapta al contenedor.
                maintainAspectRatio: false, // Permite manejar el tamaño con CSS.
                plugins: {
                  legend: {
                    display: false, // Oculta la leyenda.
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true, // El eje X empieza desde cero.
                    ticks: {
                      precision: 0, // Muestra solo números enteros.
                    },
                  },
                },
              },
            },
          );
        },
        error: () => { // Se ejecuta si falla la petición HTTP.
          this.error = 'No se pudieron cargar los comentarios por publicación.';
        },
      });
  }
}