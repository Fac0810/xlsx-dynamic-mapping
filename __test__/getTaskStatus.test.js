const mongoose = require('mongoose')
const makeTasksDb = require('../src/gateways/makeTasksDb')
const makeAddTask = require('../src/use-cases/addTask')
const makeGetTaskStatus = require('../src/use-cases/getTaskStatus')
const dotenv = require('dotenv')
dotenv.config()

describe('getTaskStatus', () => {
	let tasksDb
	let getTaskStatus
	let addTask
	let validMapping
	let validFileName

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		tasksDb = makeTasksDb()
		addTask = makeAddTask({ db: tasksDb })
		getTaskStatus = makeGetTaskStatus({ db: tasksDb })

		validMapping = { age: 'Number', name: 'String', nums: 'Array<Number>' }
		validFileName = 'file.xlsx'
	})

	afterAll(async () => {
		await mongoose.connection.close()
	})

	beforeEach(async () => {
		await mongoose.connection.collection('tasks').deleteMany({})
	})

	it('returns pending task correctly', async () => {
		const { id } = await addTask({ fileName: validFileName, mapping: validMapping })

		const status = await getTaskStatus(id)

		expect(status).toMatchObject({
			id,
			status: 'pending',
			fileName: validFileName,
			mapping: validMapping,
			createdOn: expect.any(Number)
		})
	})

	it('returns processing task correctly', async () => {
		const { id } = await addTask({ fileName: validFileName, mapping: validMapping })

		await tasksDb.update({ ...await tasksDb.findById({ id }), status: 'processing', startedOn: Date.now() })

		const status = await getTaskStatus(id)

		expect(status).toMatchObject({
			id,
			status: 'processing',
			fileName: validFileName,
			mapping: validMapping,
			createdOn: expect.any(Number),
			startedOn: expect.any(Number)
		})
	})

	it('returns done task correctly', async () => {
		const { id } = await addTask({ fileName: validFileName, mapping: validMapping })

		const validResults = [
			{
				name: 'Esteban',
				age: 30,
				nums: [1, 3, 8, 9, 12, 32, 34, 78, 97, 100]
			}
		]

		const validErrors = [
			{ row: 2, col: 1 },
			{ row: 2, col: 2 },
			{ row: 2, col: 3 }
		]

		const pendingTask = await tasksDb.findById({ id })
		await tasksDb.update({ ...pendingTask, status: 'done', startedOn: Date.now(), finishedOn: Date.now(), result: validResults, errors: validErrors })

		const status = await getTaskStatus(id)

		expect(status).toMatchObject({
			id,
			status: 'done',
			fileName: validFileName,
			mapping: validMapping,
			createdOn: expect.any(Number),
			startedOn: expect.any(Number),
			finishedOn: expect.any(Number),
			result: validResults,
			errors: validErrors
		})
	})

	it('throws if task not found', async () => {
		await expect(getTaskStatus('nonexistent')).rejects.toThrow('Task not found.')
	})

	it('throws for unknown status', async () => {
		const { id } = await addTask({ fileName: validFileName, mapping: validMapping })
		const task = await tasksDb.findById({ id })

		await tasksDb.update({ ...task, status: 'invalid-status' })

		await expect(getTaskStatus(id)).rejects.toThrow('Unknown task status: invalid-status')
	})
})