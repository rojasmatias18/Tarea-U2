# Hotel · reservas y reseñas de estadías
Patricio Rojs · Lista 3 · Desarrollo Web Avanzado

La API mantiene las reservas y los usuarios en PostgreSQL. MongoDB almacena las fichas de habitaciones y las reseñas. PostgreSQL impide reservar la misma habitación en períodos superpuestos.

## Ejecutar en Windows con Git Bash
Instala Node.js 24 con npm y abre Docker Desktop. Desde la carpeta que contiene package.json, crea tu configuración local una vez:
```bash
cp .env.example .env
notepad .env
```
Configura JWT_SECRET y DEMO_PASSWORD con valores locales. Si cambias PG_PASSWORD o MONGO_PASSWORD, actualiza también la URI correspondiente antes de crear los contenedores. Luego ejecuta:
```bash
docker compose up -d
docker compose ps
npm ci
npx prisma migrate deploy
npx prisma generate
npm run usuarios
npm start
```
Espera a que ambas bases estén listas antes de migrar. Comprueba el catálogo desde otra terminal:
```bash
curl http://localhost:3002/api/rooms
```
En una base recién creada la respuesta es una lista vacía. El entorno usa el puerto 5434 para PostgreSQL, 27018 para MongoDB y 5052 para pgAdmin.

## Probar y preparar las evidencias
Importa el JSON de postman/ y configura la variable de entorno demoPassword con el valor de DEMO_PASSWORD. La colección inicia sesión con admin@hotel.test, ana@hotel.test y luis@hotel.test. Ejecútala dos veces completas en orden con la API encendida. Reserva el número Z-987 para estas pruebas.

- [Modelado, referencias y endpoints](docs/Tarea_modelo_hibrido.md)
- [Capturas y guion para el video](docs/Evidencias.md)

Para entregar en un solo commit, conserva esta estructura en la raíz de tu repositorio y agrega tus capturas a docs/ antes de subir el proyecto. El archivo .gitignore excluye .env y node_modules/.
