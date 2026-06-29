# SmartSHOP — Plataforma de E-Commerce Full-Stack

Aplicación web de comercio electrónico lista para producción, desarrollada para el mercado peruano. Incluye experiencia de compra completa, mapa interactivo para selección de punto de entrega y panel de administración.


---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Autenticación | NextAuth v5 (Credenciales + Google OAuth) |
| ORM | Prisma 5 |
| Base de datos | PostgreSQL vía Supabase |
| Mapas | Leaflet + OpenStreetMap + Nominatim |
| Despliegue | Vercel |

---

## Funcionalidades

### Tienda
- **Catálogo de productos** con filtros por categoría, búsqueda y ordenamiento
- **Página de producto** con galería de imágenes, indicador de stock y reseñas de clientes
- **Carrito de compras** (contexto persistente, panel lateral)
- **Favoritos** con panel lateral
- **Comparación de productos** — compara hasta 3 productos en simultáneo
- **Productos vistos recientemente**
- **Checkout** con mapa interactivo para seleccionar el punto de entrega
- **Seguimiento de pedidos** — el usuario puede ver el estado de su orden en tiempo real

### Autenticación
- Login con email y contraseña (hash con bcrypt)
- Google OAuth (acceso con un clic)
- Sesión forzada a expirar al cerrar el navegador — usa flag en `sessionStorage` + JWT de NextAuth para que el usuario siempre deba iniciar sesión al abrir la app

### Mapa de Entrega
- Mapa interactivo embebido (Leaflet + OpenStreetMap, sin API key)
- Búsqueda de dirección con autocompletado vía Nominatim (filtrado a Perú)
- Pin arrastrable + clic para ubicar
- Geocodificación inversa — rellena la dirección automáticamente desde la posición del pin
- Campo de referencia para indicaciones de entrega
- Mini-mapa de solo lectura en las direcciones guardadas

### Panel de Administración
- Vista general con estadísticas en tiempo real: usuarios, productos, pedidos e ingresos
- Gestión completa de productos (crear, editar, eliminar, subir imágenes)
- Gestión de pedidos con cambio de estado (Pendiente → Confirmado → Enviado → Entregado → Cancelado)
- Gestión de usuarios con asignación de roles
- Gestión de categorías
- Configuración del sitio (nombre de la tienda, barra de anuncios, número de WhatsApp, costo de envío)

---

## Decisiones Técnicas Destacadas

**Server Components con App Router** — los datos se obtienen en el servidor en cada solicitud usando Prisma, con componentes cliente solo donde se necesita interactividad.

**Consultas DB secuenciales** — evita el agotamiento del pool de conexiones en PgBouncer de Supabase (modo transacción, `connection_limit=1`) esperando cada consulta de forma individual en lugar de usar `Promise.all`.

**Leaflet sin SSR** — Leaflet requiere el objeto `window` del navegador. Se carga con `next/dynamic` y `ssr: false`; el CSS se inyecta vía DOM con `createElement` en `useEffect` para evitar errores en tiempo de importación.

**Re-login obligatorio al abrir el navegador** — las sesiones JWT normalmente persisten. Se guarda un flag `ss_active` en `sessionStorage` (que se borra al cerrar el navegador) solo tras un login exitoso. Un componente `SessionGuard` lo verifica en cada carga de página y ejecuta `signOut` si no existe.

---

## Esquema de Base de Datos

```
User       — id, nombre, email, rol, dirección, lat, lng, referencia, teléfono
Product    — id, nombre, precio, precioOriginal, stock, categoría, imágenes[], badge, activo
Order      — id, userId, items[], total, envío, estado, metodoPago, dirección, teléfono
OrderItem  — orderId, productId, nombre, imagen, precio, cantidad
Review     — productId, userId, calificación, comentario (único por usuario por producto)
Setting    — almacén clave/valor para configuración del sitio
```

---

