const buildMakeTask = require('../src/entities/task')  
const Id = require('../src/utils/Id') 

describe('Entity: Task', () => {
  let makeTask

  beforeAll(() => {
    makeTask = buildMakeTask({ Id })
  })

  it('should create a valid task with default values', () => {
    const task = makeTask({ fileName: 'test.csv' })
    expect(Id.isValidId(task.getId())).toBe(true)
    expect(task.getFileName()).toBe('test.csv')
    expect(task.getStatus()).toBe('pending')
  })

  it('should throw error if the id is not valid', () => {
    const invalidId = { makeId: () => '123', isValidId: () => false }
    const makeInvalidTask = buildMakeTask({ Id: invalidId })

    expect(() => makeInvalidTask({ fileName: 'file.csv' }))
      .toThrow('Task must have a valid id.')
  })

  it('should throw error if fileName is invalid', () => {
    expect(() => makeTask({ fileName: '' }))
      .toThrow('Task must have a valid file name.')

    expect(() => makeTask({ fileName: 123 }))
      .toThrow('Task must have a valid file name.')
  })

  it('should throw an error if the initial status is not valid', () => {
    expect(() => makeTask({ fileName: 'file.csv', status: 'invalid' }))
      .toThrow('Task status must be one of: pending, processing, done')
  })

  it('should be able to mark the task as processing', () => {
    const task = makeTask({ fileName: 'file.csv' })
    task.markProcessing()
    expect(task.getStatus()).toBe('processing')
    expect(task.getStartedOn()).not.toBeNull()
  })

  it('It should not allow marking as processing if it is not pending.', () => {
    const task = makeTask({ fileName: 'file.csv', status: 'done' })
    expect(() => task.markProcessing())
      .toThrow('Cannot mark task as processing from status "done".')
  })

  it('You should be able to mark the task as done correctly.', () => {
    const task = makeTask({ fileName: 'file.csv' })
    task.markProcessing()

    const resultData = [{ line: 1, success: true }]
    const errorsData = []

    task.markDone(resultData, errorsData)

    expect(task.getStatus()).toBe('done')
    expect(task.getResult()).toEqual(resultData)
    expect(task.getErrors()).toEqual(errorsData)
    expect(task.getFinishedOn()).not.toBeNull()
  })

  it('should not allow marking as done if it is not processing', () => {
    const task = makeTask({ fileName: 'file.csv' })
    expect(() => task.markDone([], []))
      .toThrow('Cannot mark task as done from status "pending".')
  })

  it('should throw an error if markDone is called without resultData or errorsData', () => {
    const task = makeTask({ fileName: 'file.csv' })
    task.markProcessing()

    expect(() => task.markDone(null, []))
      .toThrow('No data was passed, expected at least an empty array')

    expect(() => task.markDone([], null))
      .toThrow('No errors were passed, expected at least an empty array')
  })
})