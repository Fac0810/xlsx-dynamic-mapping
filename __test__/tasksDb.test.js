const mongoose = require('mongoose')
const makeTasksDb = require('../src/gateways/makeTasksDb')
const buildMakeTask = require('../src/entities/task')
const Id = require('../src/utils/Id')
const dotenv = require('dotenv')
dotenv.config()

describe('tasks db', () => {
	let tasksDb
	let makeTask
	let validMapping
	let validFileName

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		tasksDb = makeTasksDb()
		makeTask = buildMakeTask({ Id })
		validMapping = { age: 'Number', name: 'String', nums: 'Array<Number>' }
		validFileName = 'file.xlsx'
	})

	afterAll(async () => {
		await mongoose.connection.close()
	})

	beforeEach(async () => {
		await mongoose.connection.collection('tasks').deleteMany({})
	})

	it('should inserts a task', async () => {
		const task = makeTask({
			fileName: validFileName,
			mapping: validMapping
		})

		const inserted = await tasksDb.insert(task)

		expect(inserted).toMatchObject({
			id: task.getId(),
			fileName: task.getFileName(),
			mapping: task.getMapping(),
			status: task.getStatus(),
			createdOn: task.getCreatedOn()
		})
	})

	it('should finds a task by id', async () => {
		const task = makeTask({
			fileName: validFileName,
			mapping: validMapping
		})

		await tasksDb.insert(task)
		const found = await tasksDb.findById({ id: task.getId() })
		expect(found).toMatchObject({
			id: task.getId(),
			fileName: task.getFileName(),
			mapping: task.getMapping(),
			status: task.getStatus(),
			createdOn: task.getCreatedOn()
		})
	})

	it('should updates a task', async () => {
		const task = makeTask({
			fileName: validFileName,
			mapping: validMapping
		})

		await tasksDb.insert(task)

		task.markProcessing()  

		const updated = await tasksDb.update(({
			id: task.getId(),
			status: task.getStatus(),
			startedOn: task.getStartedOn()
		}))

		expect(updated.status).toBe('processing')
		expect(updated.startedOn).toBeDefined()
	})
})