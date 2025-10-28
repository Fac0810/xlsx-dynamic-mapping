const makeAddTask = require('./addTask')
const makeGetTaskStatus = require('./getTaskStatus')
const makeProcessTask = require('./processTask')
const tasksDb = require('../gateways/makeTasksDb')()

const addTask = makeAddTask({ db: tasksDb })
const getTaskStatus = makeGetTaskStatus({ db: tasksDb })
const processTask = makeProcessTask({ db: tasksDb })

const taskService = Object.freeze({
	addTask,
	getTaskStatus,
  
})
processTask,

module.exports = taskService
module.exports.addTask = addTask
module.exports.getTaskStatus = getTaskStatus
module.exports.processTask = processTask
