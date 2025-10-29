const express = require('express')
const multer = require('multer')
const { createTask, getTaskStatus } = require('../controllers/taskController')
const makeCallback = require('../utils/middleware/expressCallback.js')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/task', upload.single('file'), makeCallback(async (req) => {

	let mapping
	try {
		mapping = JSON.parse(req.body.mapping)
	} catch {
		throw new Error('Invalid JSON format in "mapping" field')
	}

	const { buffer, originalname } = req.file

	return await createTask({
		body: {
			fileName: originalname,
			mapping,
			buffer
		}
	})
}))
router.get('/task/:id', makeCallback(getTaskStatus))

module.exports = router
