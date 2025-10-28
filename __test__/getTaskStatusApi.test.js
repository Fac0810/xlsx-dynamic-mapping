const { getTaskStatus } = require('../src/controllers/taskController')
const taskService = require('../src/use-cases')

jest.mock('../src/use-cases')

describe('getTaskStatus controller', () => {
	const headers = { 'Content-Type': 'application/json' }

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('returns 200 and task status when task exists', async () => {
		const mockStatus = { id: '123', status: 'pending' }
		taskService.getTaskStatus.mockResolvedValue(mockStatus)

		const req = { params: { id: '123' } }

		const response = await getTaskStatus(req)

		expect(taskService.getTaskStatus).toHaveBeenCalledWith('123')
		expect(response).toEqual({
			headers,
			statusCode: 200,
			body: { status: mockStatus }
		})
	})

	it('returns 404 if task not found', async () => {
		taskService.getTaskStatus.mockRejectedValue(new Error('Task not found.'))

		const req = { params: { id: 'nonexistent' } }

		const response = await getTaskStatus(req)

		expect(response).toEqual({
			headers,
			statusCode: 404,
			body: { error: 'Task not found.' }
		})
	})

	it('returns 500 for other errors', async () => {
		taskService.getTaskStatus.mockRejectedValue(new Error('DB connection failed'))

		const req = { params: { id: '123' } }

		const response = await getTaskStatus(req)

		expect(response).toEqual({
			headers,
			statusCode: 500,
			body: { error: 'DB connection failed' }
		})
	})
})