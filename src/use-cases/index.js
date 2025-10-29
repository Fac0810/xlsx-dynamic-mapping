const makeAddTask = require('./addTask')
const makeGetTaskStatus = require('./getTaskStatus')
const makeProcessTask = require('./processTask')
const makeParseXlsx = require('../gateways/parseXlsx')
const makeTasksDb = require('../gateways/makeTasksDb')
const tasksDb = makeTasksDb() 

const parseXlsx = makeParseXlsx({})


const addTask = makeAddTask({ db: tasksDb })
const getTaskStatus = makeGetTaskStatus({ db: tasksDb })
const processTask = makeProcessTask({ db: tasksDb , parseXlsx: parseXlsx})

const taskService = Object.freeze({
	addTask,
	getTaskStatus,
	processTask,
})


module.exports = taskService
module.exports.addTask = addTask
module.exports.getTaskStatus = getTaskStatus
module.exports.processTask = processTask
