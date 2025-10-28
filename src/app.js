const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./docs/swagger')
const taskRoutes = require('./routes/taskRoutes')
const apiKeyAuth = require('./utils/auth/auth')
const app = express()

app.use(express.json())

app.use(apiKeyAuth)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api', taskRoutes)

app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }))

module.exports = app