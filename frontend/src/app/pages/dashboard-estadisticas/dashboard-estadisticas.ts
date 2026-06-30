import { CommonModule } from '@angular/common'; // Permite usar directivas como *ngIf y *ngFor
import {
  AfterViewInit, // Ciclo de vida que se ejecuta después de que la vista HTML ya cargó
  Component, // Permite definir un componente Angular
  ElementRef, // Permite acceder directamente a un elemento HTML
  ViewChild, // Permite obtener referencias a elementos del HTML
} from '@angular/core';

import { FormsModule } from '@angular/forms'; // Permite usar ngModel en inputs
import Chart from 'chart.js/auto'; // Librería para crear gráficos

import { EstadisticasService } from '../../services/estadisticas.service'; // Servicio que consulta estadísticas al backend

// Componente del dashboard de estadísticas
@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.scss',
})
export class DashboardEstadisticas implements AfterViewInit {
  // Fechas usadas para filtrar las estadísticas
  desde = '2025-01-01';
  hasta = '2027-12-31';

  // Mensaje de error general
  error = '';

  // Guarda el total de comentarios
  totalComentarios = 0;

  // Variables para saber si no hay datos y mostrar mensajes en el HTML
  sinDatosPublicaciones = false;
  sinDatosComentariosTotal = false;
  sinDatosComentariosPublicacion = false;

  // Referencias a los canvas del HTML donde se dibujan los gráficos
  @ViewChild('graficoPublicaciones')
  graficoPublicaciones!: ElementRef<HTMLCanvasElement>;

  @ViewChild('graficoComentariosTotal')
  graficoComentariosTotal!: ElementRef<HTMLCanvasElement>;

  @ViewChild('graficoComentariosPublicacion')
  graficoComentariosPublicacion!: ElementRef<HTMLCanvasElement>;

  // Instancias de gráficos Chart.js
  chartPublicaciones: Chart | null = null;
  chartComentariosTotal: Chart | null = null;
  chartComentariosPublicacion: Chart | null = null;

  // Inyección del servicio de estadísticas
  constructor(private estadisticasService: EstadisticasService) {}

  // Se ejecuta cuando el HTML ya está disponible
  ngAfterViewInit(): void {
    this.cargarEstadisticas();
  }

  // Carga todas las estadísticas del dashboard
  cargarEstadisticas(): void {
    this.error = '';

    this.cargarPublicacionesPorUsuario();
    this.cargarComentariosTotal();
    this.cargarComentariosPorPublicacion();
  }

  // Carga y grafica publicaciones por usuario
  cargarPublicacionesPorUsuario(): void {
    this.estadisticasService
      .publicacionesPorUsuario(this.desde, this.hasta)
      .subscribe({
        next: (data) => {
          // Destruye el gráfico anterior para evitar duplicados
          this.chartPublicaciones?.destroy();

          // Verifica si no hay datos
          this.sinDatosPublicaciones = data.length === 0;

          if (this.sinDatosPublicaciones) {
            return;
          }

          // Crea gráfico de barras
          this.chartPublicaciones = new Chart(
            this.graficoPublicaciones.nativeElement,
            {
              type: 'bar',
              data: {
                labels: data.map((x) => x.usuario),
                datasets: [
                  {
                    label: 'Publicaciones',
                    data: data.map((x) => x.cantidad),
                    borderWidth: 1,
                    borderRadius: 8,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              },
            },
          );
        },
        error: () => {
          this.error = 'No se pudieron cargar las publicaciones por usuario.';
        },
      });
  }

  // Carga y grafica el total de comentarios
  cargarComentariosTotal(): void {
    this.estadisticasService
      .comentariosTotal(this.desde, this.hasta)
      .subscribe({
        next: (data) => {
          // Destruye el gráfico anterior
          this.chartComentariosTotal?.destroy();

          // Guarda el total recibido
          this.totalComentarios = data.cantidad || 0;

          // Verifica si no hay comentarios
          this.sinDatosComentariosTotal = this.totalComentarios === 0;

          if (this.sinDatosComentariosTotal) {
            return;
          }

          // Crea gráfico tipo dona
          this.chartComentariosTotal = new Chart(
            this.graficoComentariosTotal.nativeElement,
            {
              type: 'doughnut',
              data: {
                labels: ['Comentarios'],
                datasets: [
                  {
                    label: 'Comentarios totales',
                    data: [this.totalComentarios],
                    borderWidth: 2,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '68%',
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              },
            },
          );
        },
        error: () => {
          this.error = 'No se pudo cargar el total de comentarios.';
        },
      });
  }

  // Carga y grafica las publicaciones con más comentarios
  cargarComentariosPorPublicacion(): void {
    this.estadisticasService
      .comentariosPorPublicacion(this.desde, this.hasta)
      .subscribe({
        next: (data) => {
          // Destruye el gráfico anterior
          this.chartComentariosPublicacion?.destroy();

          // Ordena de mayor a menor y toma las primeras 4
          const topPublicaciones = [...data]
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 4);

          // Verifica si no hay datos
          this.sinDatosComentariosPublicacion =
            topPublicaciones.length === 0;

          if (this.sinDatosComentariosPublicacion) {
            return;
          }

          // Crea gráfico de barras horizontal
          this.chartComentariosPublicacion = new Chart(
            this.graficoComentariosPublicacion.nativeElement,
            {
              type: 'bar',
              data: {
                labels: topPublicaciones.map((x) => x.publicacion),
                datasets: [
                  {
                    label: 'Comentarios',
                    data: topPublicaciones.map((x) => x.cantidad),
                    borderWidth: 1,
                    borderRadius: 8,
                  },
                ],
              },
              options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              },
            },
          );
        },
        error: () => {
          this.error = 'No se pudieron cargar los comentarios por publicación.';
        },
      });
  }
}