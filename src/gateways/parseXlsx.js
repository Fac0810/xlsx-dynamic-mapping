const ExcelJS = require('exceljs')
const { Worker } = require('worker_threads')
const dotenv = require('dotenv')

dotenv.config()
const WORKER_POOL_SIZE = process.env.WORKER_POOL_SIZE || 2
//Todo esto era WIP, por si se ve algo raro
function makeParseXlsx({ workerPoolSize = WORKER_POOL_SIZE, batchSize = 500 }) {
	return async function parseXlsx({ buffer, mapping, db }) {
		const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(buffer)
		const results = []
		const errors = []

		let rowIndex = 0
		let batch = []

		const workers = Array.from({ length: workerPoolSize }, () =>
			new Worker(require.resolve('../workers/workerTask.js'))
		)
		let nextWorker = 0

		function runWorker(rowValues, rowIndex) {
			return new Promise((resolve) => {
				const worker = workers[nextWorker]
				nextWorker = (nextWorker + 1) % workers.length

				const listener = (msg) => {
					worker.off('message', listener)
					resolve(msg)
				}

				worker.on('message', listener)
				worker.postMessage({ rowValues, mapping, rowIndex })
			})
		}

		for await (const worksheetReader of workbookReader) {
			for await (const row of worksheetReader) {
				rowIndex++
				const rowValues = row.values.slice(1)

				const { validRow, rowErrors } = await runWorker(rowValues, rowIndex)
				
				if (validRow) {
					results.push(validRow)
					batch.push(validRow)
				}

				if (Array.isArray(rowErrors) && rowErrors.length > 0) {
					for (const err of rowErrors) {
						errors.push({
							row: rowIndex,
							col: err.col || err.column || 0
						})
					}
				}

				if (batch.length >= batchSize) {
					await db.insert(batch)
					batch = []
				}
			}
		}

		if (batch.length) await db.insert(batch)

		for (const worker of workers) worker.terminate()

		return { result: results, errors }
	}
}

module.exports = makeParseXlsx