const buildMakeTask = require('../src/entities/task')  
const Id = require('../src/utils/Id') 

describe('Entity: Task', () => {
	let makeTask
	let validMapping
	let validFileName

	beforeAll(() => {
		makeTask = buildMakeTask({ Id })
		validMapping = { age: 'Number', name: 'String', nums: 'Array<Number>' }
		validFileName = 'file.xlsx'
    
	})

	it('should create a valid task with default values', () => {
    
		const task = makeTask({ fileName: validFileName, mapping: validMapping })

		expect(task.getFileName()).toBe(validFileName)
		expect(task.getMapping()).toEqual(validMapping)
		expect(Id.isValidId(task.getId())).toBe(true)
		expect(task.getStatus()).toBe('pending')
	})

	it('should throw error if the id is not valid', () => {
		const invalidId = { makeId: () => '123', isValidId: () => false }
		const makeInvalidTask = buildMakeTask({ Id: invalidId })

		expect(() => makeInvalidTask({ fileName: validFileName, mapping: validMapping }))
			.toThrow('Task must have a valid id.')
	})

	it('should throw error if fileName is invalid', () => {
		expect(() => makeTask({ fileName: '', mapping: validMapping  }))
			.toThrow('Task must have a valid file name.')

		expect(() => makeTask({ fileName: 123, mapping: validMapping  }))
			.toThrow('Task must have a valid file name.')
	})

	it('should throw an error if the initial status is not valid', () => {
		expect(() => makeTask({ fileName: validFileName, mapping: validMapping , status: 'invalid' }))
			.toThrow('Task status must be one of: pending, processing, done')
	})

	it('should throw error for invalid mapping type', () => {
		expect(() => makeTask({ fileName: validFileName, mapping: { premium: 'Boolean' } }))
			.toThrow('Invalid mapping type for "premium". Allowed types: String, Number, Array<Number>')
	})

	it('should throw error for non-object mapping', () => {
		expect(() => makeTask({ fileName: validFileName, mapping: null }))
			.toThrow('Task must have a valid mapping object.')

		expect(() => makeTask({ fileName: validFileName, mapping: [] }))
			.toThrow('Task must have a valid mapping object.')
	})

	it('should be able to mark the task as processing', () => {
		const task = makeTask({ fileName: validFileName, mapping: validMapping  })
		task.markProcessing()
		expect(task.getStatus()).toBe('processing')
		expect(task.getStartedOn()).not.toBeNull()
	})

	it('It should not allow marking as processing if it is not pending.', () => {
		const task = makeTask({ fileName: validFileName, mapping: validMapping , status: 'done' })
		expect(() => task.markProcessing())
			.toThrow('Cannot mark task as processing from status "done".')
	})

	it('You should be able to mark the task as done correctly.', () => {
		const task = makeTask({ fileName: validFileName, mapping: validMapping  })
		task.markProcessing()

		const resultData = [
			{ name: 'Esteban', age: 30, nums: [1, 3, 8, 9, 12, 32, 34, 78, 97, 100]}
		]
    
		const errorsData = [ 
			{ row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }
		]

		task.markDone(resultData, errorsData)

		expect(task.getStatus()).toBe('done')
		expect(task.getResult()).toEqual(resultData)
		expect(task.getErrors()).toEqual(errorsData)
		expect(task.getFinishedOn()).not.toBeNull()
	})

	it('should not allow marking as done if it is not processing', () => {
		const task = makeTask({ fileName: validFileName, mapping: validMapping })
		expect(() => task.markDone([], []))
			.toThrow('Cannot mark task as done from status "pending".')
	})

	it('should throw an error if markDone is called without resultData or errorsData', () => {
		const task = makeTask({ fileName: validFileName, mapping: validMapping  })
		task.markProcessing()

		expect(() => task.markDone(null, []))
			.toThrow('No data was passed, expected at least an empty array')

		expect(() => task.markDone([], null))
			.toThrow('No errors were passed, expected at least an empty array')
	})
})