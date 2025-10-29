const taskService = require('../use-cases')

const headers = {
	'Content-Type': 'application/json'
}

async function createTask({ body }) {
	const { fileName, mapping, buffer } = body 
	try {
		const task = await taskService.addTask({ fileName, mapping })

		taskService.processTask(task.id, buffer).catch(err => {
			console.error(`Error processing task ${task.id}:`, err)
		})
		return {
			headers,
			statusCode: 201,
			body: { task }
		}
	} catch (err) {
		return {
			headers,
			statusCode: 500,
			body: { error: err.message }
		}
	}
}

async function getTaskStatus({ params }) {
	const { id } = params
	try {
		const status = await taskService.getTaskStatus(id)
		return { 
			headers,
			statusCode: 200, 
			body: { status } 
		}
	} catch (err) {
		const statusCode = err.message.includes('not found') ? 404 : 500
		return { headers,
			statusCode, 
			body: { error: err.message } 
		}
	}
}

module.exports = { createTask, getTaskStatus }