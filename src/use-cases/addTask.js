const makeTask = require('../entities')

function makeAddTask({ db }) {
	return async function addTask(taskData) {
		const task = makeTask(taskData)

		await db.insert(task)

		return { id: task.getId(), status: task.getStatus() }
	}
}

module.exports = makeAddTask