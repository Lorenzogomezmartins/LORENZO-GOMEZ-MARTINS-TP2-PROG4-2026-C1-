import { Controller, Get } from '@nestjs/common'; // Decoradores para crear controladores y rutas GET
import { AppService } from './app.service'; // Servicio que contiene la lógica de negocio

// Define este controlador como controlador raíz ('/')
@Controller()
export class AppController {
  // Inyección de dependencias del servicio AppService
  constructor(private readonly appService: AppService) {}

  // Responde a peticiones GET en la ruta '/'
  @Get()
  getHello(): string {
    // Obtiene y retorna el mensaje desde el servicio
    return this.appService.getHello();
  }
}
