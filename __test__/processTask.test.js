const mongoose = require('mongoose')
const makeTasksDb = require('../src/gateways/makeTasksDb')
const makeAddTask = require('../src/use-cases/addTask')
const makeProcessTask = require('../src/use-cases/processTask')
const dotenv = require('dotenv')
const makeGetTaskStatus = require('../src/use-cases/getTaskStatus')
dotenv.config()

describe('processTask use-case', () => {
	let tasksDb
	let addTask
	let processTask
	let validMapping
	let validFileName
	let getTaskStatus

	beforeAll(async () => {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		tasksDb = makeTasksDb()

		const parseXlsx = jest.fn().mockResolvedValue({
			result: [
				{
					name: 'Esteban',
					age: 30,
					nums: [1, 3, 8, 9, 12],
				},
			],
			errors: [
				{ row: 2, col: 1 },
				{ row: 2, col: 2 },
			],
		})

		addTask = makeAddTask({ db: tasksDb })
		processTask = makeProcessTask({ db: tasksDb, parseXlsx })
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

	it('should process a pending task and mark it done', async () => {
		const { id } = await addTask({ fileName: validFileName, mapping: validMapping })

		const resultId = await processTask(id)
		expect(resultId).toBe(id)

		const updated = await tasksDb.findById({ id })

		expect(updated.status).toBe('done')
		expect(updated.result).toEqual([
			{
				name: 'Esteban',
				age: 30,
				nums: [1, 3, 8, 9, 12],
			},
		])
		expect(updated.errors).toEqual([
			{ row: 2, col: 1 },
			{ row: 2, col: 2 },
		])
		expect(updated.startedOn).toBeDefined()
		expect(updated.finishedOn).toBeDefined()
	})

	it('should handle parseXlsx errors', async () => {
		const badParse = jest.fn().mockRejectedValue(new Error('Parsing failed'))
		const failingProcessTask = makeProcessTask({ db: tasksDb, parseXlsx: badParse })

		const { id } = await addTask({ fileName: validFileName, mapping: validMapping })

		await failingProcessTask(id)

		const updated = await tasksDb.findById({ id })

		expect(updated.status).toBe('done')
		expect(updated.errors).toEqual([{ error: 'Parsing failed' }])
		expect(updated.finishedOn).toBeDefined()
	})

	it('should throw if task does not exist', async () => {
		await expect(processTask('nonexistent')).rejects.toThrow('Task not found.')
	})

	it('should throw if task is not pending', async () => {
		const { id } = await addTask({ fileName: validFileName, mapping: validMapping })
		await tasksDb.update({ id, status: 'done' }) 

		await expect(processTask(id)).rejects.toThrow('Cannot start processing a task with status "done".')
	})

	it('should process multiple tasks in parallel without conflicts', async () => {
		const validMapping = { age: 'Number', name: 'String', nums: 'Array<Number>' }
		function generateTaskData(count, mapping) {
			return Array.from({ length: count }, (_, i) => ({
				fileName: `file${i + 1}.xlsx`,
				mapping
			}))
		}
        
		const parseXlsx = jest.fn(async ({ fileName }) => {
			await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
			return {
				result: [{ name: fileName, processed: true }],
				errors: []
			}
		})

		const processTask = makeProcessTask({ db: tasksDb, parseXlsx })


		const taskDataList = generateTaskData(200, validMapping)

		const createdTasks = await Promise.all(taskDataList.map(addTask))
		const ids = createdTasks.map(t => t.id)

		const startTime = Date.now()
		await Promise.all(ids.map(id => processTask(id)))

		for (const id of ids) {
			const status = await getTaskStatus(id)
			expect(status.status).toBe('done')
			expect(status.result[0].processed).toBe(true)
			expect(status.fileName).toMatch(/file\d+\.xlsx/)
		}

		const duration = Date.now() - startTime
		console.log(`All tasks completed in ${duration} ms`)
	})
})