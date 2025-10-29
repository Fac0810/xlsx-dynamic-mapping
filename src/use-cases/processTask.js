const makeTask = require('../entities')

function makeProcessTask({ db, parseXlsx }) {
	return async function processTask(taskId, buffer) {
		const existing = await db.findById({ id: taskId })
		if (!existing) throw new Error('Task not found.')

		const task = makeTask(existing)

		if (task.getStatus() !== 'pending') {
			throw new Error(`Cannot start processing a task with status "${task.getStatus()}".`)
		}

		task.markProcessing()
		await db.update({
			id: task.getId(),
			status: task.getStatus(),
			startedOn: task.getStartedOn(),
		})

		try {
			    
			const { result, errors } = await parseXlsx({
				buffer,            
				mapping: task.getMapping(),
				db,
			})
			task.markDone(result, errors)

			await db.update({
				id: task.getId(),
				status: task.getStatus(),
				result: task.getResult(),
				errors: task.getErrors(),
				finishedOn: task.getFinishedOn(),
			})

		} catch (err) {
			await db.update({
				id: task.getId(),
				status: 'done',
				errors: [{ error: err.message }],
				finishedOn: Date.now(),
			})
		}

		return task.getId()
	}
}

module.exports = makeProcessTask