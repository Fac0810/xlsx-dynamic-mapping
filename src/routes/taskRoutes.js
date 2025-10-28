const express = require('express')
const { createTask, getTaskStatus } = require('../controllers/taskController')
const makeCallback = require('../utils/middleware/expressCallback.js')

const router = express.Router()

router.post('/task', makeCallback(createTask))
router.get('/task/:id', makeCallback(getTaskStatus))

module.exports = router
