# SalesMaster PRO - Frontend

Sistema Integral de Gestión de Ventas y Facturación - Frontend React

## Descripción

SalesMaster PRO es un sistema completo para la gestión de ventas y facturación. Este frontend está construido con React, Vite, Tailwind CSS y React Router, e incluye autenticación JWT y CRUD completo para Clientes, Productos, Pedidos y Facturas.

## Tecnologías Utilizadas

- **React 19.2.0** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite 7.2.4** - Build tool y servidor de desarrollo
- **React Router DOM 6.28.0** - Navegación y enrutamiento
- **Axios 1.7.7** - Cliente HTTP para peticiones API
- **Tailwind CSS 3.4.13** - Framework CSS utility-first
- **SweetAlert2 11.14.5** - Librería para alertas y notificaciones

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Backend de SalesMaster PRO ejecutándose en `http://localhost:8080`

## Instalación

1. **Clonar el repositorio** (si aplica) o navegar al directorio del proyecto:
```bash
cd salesmaster-frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
   - Crear un archivo `.env` en la raíz del proyecto (si no existe)
   - Agregar la siguiente línea:
```env
VITE_API_URL=http://localhost:8080
```

4. **Iniciar el servidor de desarrollo**:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que Vite asigne automáticamente).

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Clientes/       # Componentes de Clientes
│   ├── Productos/      # Componentes de Productos
│   ├── Pedidos/        # Componentes de Pedidos
│   ├── Facturas/       # Componentes de Facturas
│   └── Layout/         # Header, Sidebar, MainLayout
├── context/            # Context API para estado global
│   └── AuthContext.jsx # Contexto de autenticación
├── pages/              # Páginas principales
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── Dashboard.jsx
│   ├── ClientesPage.jsx
│   ├── ProductosPage.jsx
│   ├── PedidosPage.jsx
│   └── FacturasPage.jsx
├── Routes/             # Rutas protegidas
│   └── PrivateRoute.jsx
├── services/           # Servicios API
│   ├── api.js          # Configuración de Axios
│   ├── authService.js
│   ├── clienteService.js
│   ├── productoService.js
│   ├── pedidoService.js
│   └── facturaService.js
├── App.jsx             # Componente principal con rutas
├── main.jsx            # Punto de entrada
└── index.css           # Estilos globales con Tailwind
```

## Funcionalidades

### Autenticación
- **Login**: Inicio de sesión con email y contraseña
- **Registro**: Creación de nuevos usuarios (ADMIN o VENDEDOR)
- **Protección de rutas**: Solo usuarios autenticados pueden acceder
- **Manejo de tokens JWT**: Almacenamiento en localStorage

### Gestión de Clientes
- Listar todos los clientes
- Crear nuevo cliente (con validaciones)
- Editar cliente existente
- Eliminar cliente (con confirmación)

### Gestión de Productos
- Listar todos los productos
- Crear nuevo producto (con validaciones)
- Editar producto existente
- Eliminar producto (con confirmación)

### Gestión de Pedidos
- Listar todos los pedidos
- Crear nuevo pedido:
  - Selección de cliente
  - Agregar múltiples productos con cantidades
  - Cálculo automático de totales
- Eliminar pedido (con confirmación)

### Gestión de Facturas
- Listar todas las facturas
- Crear nueva factura desde un pedido existente
- Eliminar factura (con confirmación)

### Dashboard
- Estadísticas generales del sistema
- Contadores de Clientes, Productos, Pedidos y Facturas

## Validaciones

Todos los formularios incluyen validaciones similares al patrón del proyecto de referencia:

- **Campos obligatorios**: Validación de campos requeridos
- **Email**: Validación de formato de email
- **Números**: Validación de números positivos para precios y cantidades
- **Feedback visual**: Mensajes de error en rojo debajo de cada campo

## Endpoints del Backend

El frontend se comunica con el backend en `http://localhost:8080/api`:

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Clientes
- `GET /api/clientes` - Listar
- `GET /api/clientes/{id}` - Obtener por ID
- `POST /api/clientes` - Crear
- `PUT /api/clientes/{id}` - Actualizar
- `DELETE /api/clientes/{id}` - Eliminar

### Productos
- `GET /api/productos` - Listar
- `GET /api/productos/{id}` - Obtener por ID
- `POST /api/productos` - Crear
- `PUT /api/productos/{id}` - Actualizar
- `DELETE /api/productos/{id}` - Eliminar

### Pedidos
- `GET /api/pedidos` - Listar
- `GET /api/pedidos/{id}` - Obtener por ID
- `POST /api/pedidos` - Crear
- `PUT /api/pedidos/{id}` - Actualizar
- `DELETE /api/pedidos/{id}` - Eliminar

### Facturas
- `GET /api/facturas` - Listar
- `GET /api/facturas/{id}` - Obtener por ID
- `POST /api/facturas` - Crear
- `PUT /api/facturas/{id}` - Actualizar
- `DELETE /api/facturas/{id}` - Eliminar

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta ESLint

## Configuración de Producción

1. Actualizar la variable `VITE_API_URL` en `.env` con la URL del backend en producción
2. Ejecutar `npm run build`
3. Los archivos optimizados estarán en la carpeta `dist/`

## Notas Importantes

- El backend debe estar ejecutándose antes de iniciar el frontend
- El token JWT se almacena en `localStorage` y expira en 24 horas
- Si el token expira, el usuario será redirigido automáticamente al login
- Todos los endpoints (excepto login y registro) requieren autenticación JWT

## Rol de Usuarios

- **ADMIN**: Acceso completo al sistema
- **VENDEDOR**: Acceso a funcionalidades de ventas (configurable según backend)

## Troubleshooting

### Error de conexión con el backend
- Verificar que el backend esté ejecutándose en `http://localhost:8080`
- Verificar la variable `VITE_API_URL` en el archivo `.env`

### Error 401 (Unauthorized)
- El token ha expirado. Iniciar sesión nuevamente
- Verificar que el token se esté enviando en las peticiones

### Error al cargar datos
- Verificar la consola del navegador para ver errores específicos
- Verificar que los endpoints del backend estén funcionando correctamente

## Licencia

Este proyecto es parte del sistema SalesMaster PRO.
