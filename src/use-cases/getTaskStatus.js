function makeGetTaskStatus({ db }) {
	return async function getTaskStatus(taskId) {
		const task = await db.findById({ id: taskId })
		if (!task) {
			throw new Error('Task not found.')
		}

		const {
			id,
			status,
			fileName,
			mapping,
			createdOn,
			startedOn,
			finishedOn,
			result,
			errors
		} = task

		switch (status) {
		case 'pending':
			return {
				id,
				status,
				fileName,
				mapping,
				createdOn
			}

		case 'processing':
			return {
				id,
				status,
				fileName,
				mapping,
				createdOn,
				startedOn
			}

		case 'done':
			return {
				id,
				status,
				fileName,
				mapping,
				createdOn,
				startedOn,
				finishedOn,
				result,
				errors
			}

		default:
			throw new Error(`Unknown task status: ${status}`)
		}
	}
}

module.exports = makeGetTaskStatus