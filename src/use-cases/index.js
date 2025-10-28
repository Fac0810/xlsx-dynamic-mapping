const makeAddTask = require('./addTask')
const makeGetTaskStatus = require('./getTaskStatus')
//const makeProcessTask = require('./markTaskProcessing')
const tasksDb = require('../gateways/makeTasksDb')()

const addTask = makeAddTask({ db: tasksDb })
const getTaskStatus = makeGetTaskStatus({ db: tasksDb })
//const markTaskProcessing = makeProcessTask({ db: tasksDb })

const taskService = Object.freeze({
	addTask,
	getTaskStatus,
  
})
//markTaskProcessing,

module.exports = taskService
module.exports.addTask = addTask
module.exports.getTaskStatus = getTaskStatus
//module.exports.markTaskProcessing = markTaskProcessing