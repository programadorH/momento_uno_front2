# Momento 1 - Frontend II (React + Vite)

Proyecto académico desarrollado para el **Momento 1** del módulo **Frontend II** en **CESDE**. La aplicación está construida con React y Vite bajo una arquitectura modular orientada a componentes reutilizables, enfocada en la gestión de vistas y funcionalidades del módulo de **Comunidad y Valoraciones**.

---

## 🛠️ Tecnologías Utilizadas

* **React** (Biblioteca principal de interfaz de usuario)
* **Vite** (Entorno de desarrollo y empaquetador)
* **JavaScript (ES6+)**
* **CSS3** (Estilos globales y hojas de estilo personalizadas)
* **Git / GitHub** (Control de versiones y flujo de trabajo por ramas *feature*)
* **ESLint** (Control de calidad y formato de código)

---

## 🌿 Flujo de Ramas y Desarrollo Activo

El desarrollo sigue una estrategia basada en ramas de funcionalidades (*feature branches*) derivadas de `main`:

* **`main`**: Rama principal estable del proyecto.
* **`feature/comunidad/G6-FAV-F01-boton`**: Rama activa de desarrollo correspondiente al **Grupo 6** (módulo de Comunidad), centrada en la implementación y estilización del componente interactivo de botón de acción/favoritos (`FAV-F01`) y su integración dentro de las vistas del sistema.

---

## 📂 Estructura del Proyecto

```text
momento_uno_front2/
├── public/
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── estilos.css
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── pages/
│   │       └── Valoracion/
│   │           └── Valoracion.jsx
│   ├── js/
│   │   └── globals.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js