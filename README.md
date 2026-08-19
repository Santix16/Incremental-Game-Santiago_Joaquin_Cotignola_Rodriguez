# Incremental Game - Santiago Joaquin Cotignola Rodriguez

Juego incremental desarrollado en Angular para gestionar recursos, contratar trabajadores, producir artículos y progresar con un sistema de economía y logros. El proyecto incluye pantalla de login, registro, menú, tienda, estadísticas, ajustes, créditos y soporte para Android mediante Capacitor.

## ¿Qué es este proyecto?

Es un juego tipo idle/tycoon en el que el usuario empieza con unos recursos mínimos y debe ir ampliando su producción para ganar dinero y desbloquear objetivos. La mecánica principal consiste en:

- Recolectar recursos naturales: madera, hierro, silicio, petróleo y oro.
- Contratar trabajadores especializados para automatizar la producción.
- Crear productos con distintos materiales y precios de venta.
- Mejorar el flujo de ingresos y la eficiencia del negocio.
- Desbloquear logros según el progreso del jugador.
- Guardar la partida automáticamente en el navegador.

## Características principales

- Sistema de recursos en tiempo real.
- Gestión de trabajadores por tipo de recurso.
- Producción de artículos con costes y venta.
- Sistema de logros y objetivos.
- Persistencia de progreso con localStorage.
- Menú principal, login y registro.
- Pantallas de estadísticas, ajustes y créditos.
- Compatibilidad con web, Electron y Android.

## Capturas de pantalla

Aún no se han añadido capturas del juego en este repositorio, pero se recomienda incluir:

- pantalla principal del menú
- vista de gameplay con recursos y trabajadores
- tienda o pantalla de producción
- vista de logros o estadísticas

## Tecnologías utilizadas

- Angular
- TypeScript
- RxJS
- CSS
- Electron
- Capacitor
- JSON Server

## Requisitos previos

Necesitarás tener instalado:

- Node.js 18 o superior
- npm
- Android Studio (solo si quieres compilar para Android)
- Java JDK (para Android/Gradle)

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd incremental-game-santiago-alejandro
```

2. Instala las dependencias:

```bash
npm install
```

## Scripts disponibles

| Script | Comando | Descripción |
| --- | --- | --- |
| start | `npm start` | Inicia Angular en modo desarrollo |
| build | `npm run build` | Compila la aplicación |
| test | `npm test` | Ejecuta la suite de pruebas |
| server | `npm run server` | Levanta el backend JSON Server |
| electron | `npm run electron` | Ejecuta la app con Electron |
| package | `npm run package` | Genera el paquete de escritorio |
| package-win | `npm run package-win` | Genera el instalador para Windows |
| package-linux | `npm run package-linux` | Genera el paquete para Linux |
| lint | `npm run lint` | Ejecuta el análisis estático |

## Cómo ejecutar la aplicación

### 1) Levantar el servidor de datos

El juego usa un backend local con JSON Server para login, registro y ranking. Ejecuta:

```bash
npm run server
```

O si prefieres hacerlo manualmente:

```bash
cd server
npx json-server --watch db.json --port 3000
```

> El backend queda disponible normalmente en `http://localhost:3000`.

### 2) Iniciar la app web

```bash
npm start
```

Esto inicia Angular y normalmente la aplicación queda disponible en el puerto 4200.

### 3) Ejecutar pruebas

```bash
npm test
```

Si quieres ejecutarlas sin modo watch, puedes usar:

```bash
npx ng test --watch=false
```

### 4) Ejecutar en Electron

```bash
npm run electron
```

### 5) Compilar para Android con Capacitor

Primero genera el build web:

```bash
npm run build
```

Luego sincroniza con Android:

```bash
npx cap sync android
```

Y abre el proyecto en Android Studio:

```bash
npx cap open android
```

Si es la primera vez, también puedes añadir la plataforma:

```bash
npx cap add android
```

## Estructura del proyecto

```text
.
├── android/                 # Proyecto Android generado por Capacitor
├── public/                  # Recursos públicos
├── server/                  # Base de datos JSON y backend local
│   └── db.json              # Datos del servidor
├── src/
│   ├── app/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── interfaces/      # Interfaces del juego
│   │   ├── services/        # Servicios (estado del juego, sonido, usuario)
│   │   ├── views/           # Pantallas principales del juego
│   │   ├── app.routes.ts    # Rutas de navegación
│   │   ├── app.ts           # Componente raíz
│   │   └── app.css          # Estilos principales
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── capacitor.config.ts
├── package.json
├── README.md
├── tsconfig.json
└── ...
```

## Cómo jugar

1. Inicia la aplicación.
2. Registra o inicia sesión.
3. Entra al menú principal.
4. Revisa tus recursos y dinero iniciales.
5. Contrata trabajadores para generar recursos automáticamente.
6. Mejora la producción para aumentar los ingresos.
7. Fabrica productos y vende el stock para ganar más dinero.
8. Completa logros para avanzar en la progresión.

## Guardado del progreso

El juego guarda parte de la sesión del usuario con localStorage y también mantiene datos persistentes del usuario en el servidor JSON. Esto permite conservar el progreso entre recargas y reinicios parciales de la aplicación.

## Créditos

Proyecto desarrollado como juego incremental con enfoque de aprendizaje en Angular, gestión de estado, lógica de progresión y soporte multiplataforma.

