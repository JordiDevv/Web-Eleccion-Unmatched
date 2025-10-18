# Web Elección Unmatched (Asignador de Héroes)

Aplicación web que asigna héroes a jugadores según sus prioridades.  
Permite registrar usuarios con preferencias y luego calcular asignaciones, resolviendo conflictos de prioridad.

---

## 🧰 Tecnologías usadas

- **Lenguaje / Runtime:** JavaScript (Node.js)  
- **Framework / librería:** Express  
- **Base de datos:** SQLite  
- **Frontend / Vista:** HTML / CSS (interfaz simple)  
- **Extras:** SQL script para inicializar tablas (`CreateTable.sql`)

---

## 🏗 Arquitectura / Estructura del código

- `server.js` — Punto de entrada y configuración del servidor Express  
- `database.js` — Lógica de conexión a la base de datos SQLite  
- `public/` — Archivos estáticos HTML / CSS / JS del frontend  
- `CreateTable.sql` — Script para crear las tablas iniciales  
- Controladores / rutas / lógica de negocio implementada dentro de `server.js` (o subdividida si ya está modularizado)

---

## 🚀 Instalación y ejecución (bash)

1. Clona el repositorio  
   git clone https://github.com/JordiDevv/Web-Eleccion-Unmatched.git  
   cd Web-Eleccion-Unmatched
2. Instala dependencias  
   npm install  
3. Inicializa la base de datos  
   sqlite3 users.db < CreateTable.sql  
4. Ejecuta la aplicación  
   npm start  
5. Abre tu navegador en http://localhost:8000 (o el puerto indicado) para ver la interfaz o usar la API.  

---

## 🧪 Uso / ejemplos de API

POST /check-inputs-calculator — Validar entradas del usuario antes de calcular  
POST /calculate-prio — Realiza el cálculo de prioridades y asigna héroes  
POST /update-database — Guarda las prioridades resultantes en la base de datos  

---

📸 Demo

[Demo técina](./demo.gif)

---

## 🧠 Principales desafíos y aprendizajes

Diseñar lógica que resuelva conflictos de prioridades de forma consistente  
Integrar frontend simple con backend (sin framework grande)  
Manejo de base de datos SQLite y consultas eficientes  
Estructuración de código para mantenimiento y claridad  
Validación de datos, errores y rutas HTTP

---

🧑 Autor y contacto

Desarrollado por Jorge Sanz (JordiDevv)
GitHub: [JordiDevv](https://github.com/JordiDevv)
Contacto: [jordidevv@gmail.com](mailto:jordidevv@gmail.com)
LinkedIn: [Jorge Sanz](https://www.linkedin.com/in/jordidevv/)
