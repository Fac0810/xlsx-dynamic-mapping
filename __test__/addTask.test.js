const mongoose = require('mongoose')
const makeAddTask = require('../src/use-cases/addTask')
const makeTasksDb = require('../src/gateways/makeTasksDb')
const dotenv = require('dotenv')
dotenv.config()

describe('add task', () => {
	let tasksDb
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

		validMapping = { age: 'Number', name: 'String', nums: 'Array<Number>' }
		validFileName = 'file.xlsx'
	})

	afterAll(async () => {
		await mongoose.connection.close()
	})

	beforeEach(async () => {
		await mongoose.connection.collection('tasks').deleteMany({})
	})

	it('should insert a new task in the database', async () => {
		const taskData = { fileName: validFileName, mapping: validMapping }

		const result = await addTask(taskData)

		const inserted = await tasksDb.findById({ id: result.id })

		expect(inserted).toMatchObject({
			id: result.id,
			fileName: validFileName,
			mapping: validMapping,
			status: 'pending',
		})

		expect(result).toEqual({
			id: expect.stringMatching(/^c/),
			status: 'pending'
		})
	})

	it('should throw if fileName is invalid', async () => {
		const invalidTask = { fileName: '', mapping: validMapping }

		await expect(addTask(invalidTask)).rejects.toThrow('Task must have a valid file name.')
	})

	it('should throw if mapping is invalid', async () => {
		const invalidTask = { fileName: validFileName, mapping: 'not-an-object' }

		await expect(addTask(invalidTask)).rejects.toThrow('Task must have a valid mapping object.')
	})
})