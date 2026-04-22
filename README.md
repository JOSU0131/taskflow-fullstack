# Taskflow 5 - Fullstack - Idea de Web Propia

## 🔨 HammerFlow Forge: Marketplace & Hobby Hub

Bienvenido a **HammerFlow Forge**, una plataforma fullstack diseñada para apasionados del hobby de las miniaturas. Este proyecto integra una gestión avanzada de inventario, sistemas de mecenazgo (crowdfunding) y formación técnica en un entorno profesional y tipado.

Integrando React, TypeScript, Node.js/Express y metodologías Agile.

---

## 🚀 Enlaces del Proyecto

* **Tablero de Organización (Trello):** [https://trello.com/b/LeLvBjuK/my-trello-board]
* **Despliegue Frontend (Vercel):** [Enlace al deploy]
* **API / Backend:** [Enlace al server si aplica]

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **React 18** (Vite)
* **TypeScript** (Tipado estricto y uniones discriminadas)
* **Tailwind CSS** (Diseño responsive y estilizado profesional)
* **React Router** (Navegación SPA)
* **Luxon** (Gestión compleja de tiempos y fechas)

### Backend
* **Node.js & Express**
* **Arquitectura por capas** (Routes, Controllers, Services)
* **REST API** (Consumo de datos tipado)

---

## 📋 Metodología y Organización

Para este desarrollo hemos aplicado principios de la metodología **Agile**, utilizando un tablero **Kanban** en Trello para el seguimiento de tareas. Puedes consultar la investigación teórica en:
👉 [docs/agile.md](./docs/agile.md)

---

## 📐 Arquitectura de la Aplicación

La aplicación se basa en un **Marketplace Inteligente** que maneja diferentes estados de negocio mediante **Uniones Discriminadas** en TypeScript:

1.  **Venta Directa:** Gestión de stock y precios fijos.
2.  **Mecenazgo:** Seguimiento de metas de recaudación y fechas de cierre.
3.  **Academia:** Tutoriales con niveles de dificultad y tiempos de duración.

### Estructura de Documentación (Paso a Paso)
El proceso de construcción está documentado al detalle en la carpeta `docs/`:

* **Idea y MVP:** [docs/idea.md](./docs/idea.md)
* **Gestión del Proyecto:** [docs/project-management.md](./docs/project-management.md)
* **Diseño y Arquitectura:** [docs/design.md](./docs/design.md)
* **Componentes y Hooks:** [docs/components.md](./docs/components.md) | [docs/hooks.md](./docs/hooks.md)
* **Capa de API y Red:** [docs/api-client.md](./docs/api-client.md)

---

## 💻 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/taskflow-fullstack.git](https://github.com/tu-usuario/taskflow-fullstack.git)
    ```

2.  **Instalar dependencias:**
    ```bash
    # En la raíz (o carpeta client)
    npm install
    ```

3.  **Ejecutar en modo desarrollo:**
    ```bash
    npm run dev
    ```

---

## 🧠 Reflexión Final
Este proyecto ha servido para consolidar la conexión entre el frontend y el backend, asegurando que el contrato de datos sea coherente mediante interfaces de TypeScript. Puedes leer la retrospectiva completa en [docs/retrospective.md](./docs/retrospective.md).