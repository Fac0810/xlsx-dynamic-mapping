const { createTask } = require('../src/controllers/taskController')
const taskService = require('../src/use-cases')

jest.mock('../src/use-cases/')

describe('createTask controller', () => {
	const headers = { 'Content-Type': 'application/json' }

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should returns 201 and the created task when successful', async () => {
		const mockTask = { id: '123', fileName: 'file.xlsx', mapping: { age: 'Number' } }
		taskService.addTask.mockResolvedValue(mockTask)
		taskService.processTask = jest.fn().mockResolvedValue(mockTask.id) 

		const req = { body: { fileName: 'file.xlsx', mapping: { age: 'Number' } } }

		const response = await createTask(req)

		expect(taskService.addTask).toHaveBeenCalledWith(req.body)
		expect(response).toEqual({
			headers,
			statusCode: 201,
			body: { task: mockTask }
		})
	})

	it('should returns 500 if task creation fails', async () => {
		taskService.addTask.mockRejectedValue(new Error('DB error'))

		const req = { body: { fileName: 'file.xlsx', mapping: { age: 'Number' } } }

		const response = await createTask(req)

		expect(response).toEqual({
			headers,
			statusCode: 500,
			body: { error: 'DB error' }
		})
	})
})