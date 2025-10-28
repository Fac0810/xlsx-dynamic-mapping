const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	fileName: { type: String, required: true },
	mapping: { type: Object, required: true },
	status: { type: String, default: 'pending' },
	createdOn: { type: Number, default: () => Date.now() },
	startedOn: { type: Number, default: null },
	finishedOn: { type: Number, default: null },
	result: { type: Object, default: null },
	errors: { type: Array, default: [] }
})

module.exports = mongoose.model('Task', taskSchema)