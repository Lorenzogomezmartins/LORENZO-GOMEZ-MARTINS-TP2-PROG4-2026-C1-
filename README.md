# Red Social - Programación IV

## Alumno

**Lorenzo Gomez Martins**

---

## Tecnologías utilizadas

### Frontend
- Angular
- TypeScript
- SCSS
- Reactive Forms

### Backend
- NestJS
- Node.js
- TypeScript
- JWT
- bcryptjs

### Base de Datos
- MongoDB

---

## Deploy

### Frontend
Pendiente

### Backend
Pendiente

---

## Descripción del Proyecto

Red Social desarrollada para la materia Programación IV de la Universidad Tecnológica Nacional (UTN) - Facultad Regional Avellaneda.

La aplicación permite a los usuarios registrarse, iniciar sesión, administrar su perfil, realizar publicaciones, comentar y reaccionar a publicaciones de otros usuarios.

---

# Sprint #1

## Frontend

- Creación del proyecto Angular.
- Implementación de las pantallas:
  - Login
  - Registro
  - Publicaciones
  - Mi Perfil
- Navegación entre componentes mediante Angular Router.
- Formularios reactivos con validaciones.
- Favicon personalizado.
- Diseño visual uniforme en toda la aplicación.

## Backend

- Creación del proyecto NestJS.
- Creación de módulos:
  - Autenticación
  - Usuarios
  - Publicaciones
- Registro de usuarios.
- Login por correo electrónico o nombre de usuario.
- Contraseñas encriptadas mediante bcrypt.
- Integración con MongoDB.
- Almacenamiento de imagen de perfil mediante URL.

---

# Sprint #2

## Frontend

- Implementación de la página Publicaciones.
- Creación del componente PublicacionCard.
- Creación de publicaciones con imagen opcional.
- Ordenamiento de publicaciones por:
  - Fecha.
  - Cantidad de me gusta.
- Paginación de publicaciones.
- Sistema de me gusta.
- Eliminación de publicaciones propias.
- Implementación de la pantalla Mi Perfil.
- Visualización de datos del usuario.
- Visualización de las últimas 3 publicaciones del usuario.

## Backend

- Creación del Schema de Publicaciones.
- Creación del módulo Publicaciones.
- Alta de publicaciones.
- Baja lógica de publicaciones.
- Listado de publicaciones.
- Filtrado de publicaciones por usuario.
- Ordenamiento por fecha o cantidad de me gusta.
- Paginación mediante offset y limit.
- Sistema de me gusta.
- Relación entre usuarios y publicaciones.
- Integración con MongoDB.

---


# Sprint #3

## Frontend

- Implementación de comentarios en publicaciones.
- Visualización de comentarios ordenados.
- Carga inicial limitada de comentarios.
- Botón para cargar más comentarios.
- Creación de nuevos comentarios.
- Edición de comentarios propios.
- Indicador de comentario editado.
- Almacenamiento del token recibido en login y registro.
- Creación de la pantalla Cargando.
- Validación del token al iniciar la aplicación.
- Redirección automática según estado de sesión.
- Manejo de error 401 redirigiendo al login.

## Backend

- Creación del Schema de Comentarios.
- Creación del módulo Comentarios.
- Creación del controller de comentarios.
- Alta de comentarios en publicaciones.
- Edición de comentarios propios.
- Marcado de comentarios editados.
- Listado de comentarios por publicación.
- Ordenamiento de comentarios por fecha.
- Paginación de comentarios mediante offset y limit.
- Relación entre usuarios, publicaciones y comentarios.
- Generación de token JWT en login y registro.
- Validación de token mediante ruta autorizar.
- Refresco de token mediante ruta refrescar.
- Expiración del token a los 15 minutos.
---

# Sprint #4

Pendiente.

---


