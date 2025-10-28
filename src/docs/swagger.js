const swaggerJsdoc = require('swagger-jsdoc')

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Clean Architecture API',
		version: '1.0.0',
		description: 'API base del challenge con arquitectura limpia y Swagger configurado',
	},
	servers: [
		{ 
			url: 'http://localhost:3000', 
			description: 'Servidor local' 
		},
	],
	components: {
		securitySchemes: {
			ApiKeyAuth: {
				type: 'apiKey',
				in: 'header',
				name: 'x-api-key'
			}
		}
	},security: [{ ApiKeyAuth: [] }],
	paths: {
		'/task': {
			post: {
				summary: 'Create a new task',
				security: [{ ApiKeyAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									fileName: { type: 'string' },
									mapping: { type: 'object' }
								},
								required: ['fileName', 'mapping']
							}
						}
					}
				},
				responses: {
					201: { description: 'Task created successfully' },
					403: { description: 'Forbidden: invalid API key' },
					500: { description: 'Server error' }
				}
			}
		},
		'/task/{id}': {
			get: {
				summary: 'Get status of a task',
				security: [{ ApiKeyAuth: [] }],
				parameters: [
					{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
				],
				responses: {
					200: { description: 'Task status retrieved successfully' },
					404: { description: 'Task not found' },
					403: { description: 'Forbidden: invalid API key' },
					500: { description: 'Server error' }
				}
			}
		}
	}
}

const options = {
	swaggerDefinition,
	apis: ['./src/routes/*.js'],
}

module.exports = swaggerJsdoc(options)