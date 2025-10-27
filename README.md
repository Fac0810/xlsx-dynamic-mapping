# Servicio de carga de planillas Excel

Este proyecto implementa un servicio de apis para la carga de archivos .xlsx con:

- Validación dinamica formato del archivo
- Procesamiento de los datos a formato json
- Notificación de estado del procesamiento
- Notificacion de errores en el mapeo
- Consultas simultaneas

---

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- Multer (para uploads de archivos)
- Swagger (documentación de la API)
- Jest + Supertest (tests)