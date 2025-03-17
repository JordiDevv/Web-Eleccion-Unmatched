# 🏆 Asignador de Héroes 🏆

Este proyecto es una aplicación web que asigna héroes a jugadores en función de sus prioridades. Incluye una página para visualizar la tabla de prioridades y otra con un formulario para registrar usuarios.

## 🚀 Tecnologías utilizadas

- 🖥️ JavaScript (frontend y backend)
- ⚡ Node.js con Express
- 🗄️ SQLite para almacenamiento de datos
- 🎨 HTML para la interfaz de usuario

## 🎮 Uso

1. 📝 Registrar usuarios junto con sus prioridades en la página de registro.
2. 🔢 En la página de cálculos, ingresar los jugadores a los que se les asignará un héroe.
3. 🎯 El sistema asigna héroes según las prioridades ingresadas, resolviendo conflictos si varios jugadores eligen el mismo héroe con la misma prioridad.
4. 💾 Los datos se almacenan y actualizan en la base de datos.

## 🧠 Funcionamiento del Algoritmo

El algoritmo:
1. 📊 Ordena a los jugadores según su mayor prioridad disponible.
2. 🏅 Asigna a cada jugador su héroe de mayor prioridad.
3. ⚔️ Si hay conflictos (varios jugadores tienen la prioridad más alta para el mismo héroe), se resuelve de la siguiente manera:
   - 🔝 Se le otorgará el héroe al jugador con el valor de prioridad más alto asignado para ese héroe.
   - 🎲 En caso de empate, se otorgará de manera aleatoria entre los candidatos.
4. 🔄 Los jugadores que pierden un conflicto reciben su siguiente héroe disponible con mayor prioridad.
5. 🔁 Se repite el proceso hasta que todos los jugadores tengan un héroe asignado sin conflictos.
6. 📥 Finalmente, la base de datos se actualiza con las nuevas prioridades.

## 🌐 API

El proyecto cuenta con varias rutas para la interacción con el servidor:

### `POST /check-inputs-calculator`
✅ Verifica que los datos ingresados sean válidos antes de procesarlos.

### `POST /calculate-prio`
🔢 Realiza el cálculo de prioridades y asigna los héroes a los jugadores.

### `POST /update-database`
💾 Actualiza la base de datos con las nuevas prioridades de los jugadores.

## 👨‍💻 Autor
Este proyecto fue desarrollado por [JordiDevv].
