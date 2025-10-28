const Task = require('./models/task')

function makeTasksDb() {
	return Object.freeze({
		insert,
		findById,
		update,
	})

	async function insert(task) {
		const created = await Task.create({
			id: task.getId(),
			fileName: task.getFileName(),
			mapping: task.getMapping(),
			status: task.getStatus(),
			createdOn: task.getCreatedOn()
		})
		return created.toObject()
	}

	async function findById({ id }) {
		const found = await Task.findOne({ id }).lean()
		return found
	}

	async function update({ id, ...props }) {
		const updated = await Task.findOneAndUpdate({ id }, props, { new: true }).lean()
		return updated
	}
}

module.exports = makeTasksDb