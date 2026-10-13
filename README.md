# Analytic Consulting — sitio web

Sitio estático (HTML, CSS y JS, sin dependencias) listo para GitHub Pages.

## Estructura

- `index.html` — página: inicio, cifras, nosotros, servicios, método, equipo y contacto.
- `styles.css` — estilos y tokens del sistema de diseño (colores, tipografía, espaciado).
- `team.js` — **datos del equipo**. Edite aquí la información de cada CV.
- `main.js` — menú móvil, tarjetas del equipo, filtros por área, perfil en ventana y animaciones.

## Cómo actualizar el equipo

1. Abra `team.js` y reemplace los datos de ejemplo por los de cada consultor (nombre, cargo, área, resumen, formación, experiencia, especialidades).
2. Para las fotos, súbalas a `img/equipo/` y ponga la ruta en `foto` (p. ej. `"img/equipo/ana.jpg"`). Sin foto se muestran las iniciales.
3. Los filtros se generan solos a partir del campo `area`.

## Pendiente de completar

- Correo, teléfono y dirección reales en la sección de contacto (`index.html`).
- Cifras de la sección de estadísticas (`data-count`).
- El formulario usa `mailto:`; para recibir mensajes sin abrir el cliente de correo, conecte un servicio como Formspree.
