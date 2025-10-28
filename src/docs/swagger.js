const swaggerJsdoc = require('swagger-jsdoc');

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
};

const options = {
	swaggerDefinition,
	apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);