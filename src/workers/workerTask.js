const { parentPort } = require('worker_threads')
//Todo esto era WIP, por si se ve algo raro
parentPort.on('message', ({ rowValues, mapping, rowIndex }) => {
	const obj = {}
	const errors = []
	let validRow = true

	Object.entries(mapping).forEach(([key, type], colIndex) => {
		const isOptional = key.endsWith('?')
		const cleanKey = key.replace('?', '')
		const value = rowValues[colIndex]

		if (value === undefined || value === null) {
			if (!isOptional) {
				validRow = false
				errors.push({ row: rowIndex, col: colIndex + 1 })
			}
			return
		}

		if (type === 'String') {
			if (typeof value === 'string') obj[cleanKey] = value
			else {
				validRow = false
				errors.push({ row: rowIndex, col: colIndex + 1 })
			}
		} else if (type === 'Number') {
			const num = Number(value)
			if (!isNaN(num)) obj[cleanKey] = num
			else {
				validRow = false
				errors.push({ row: rowIndex, col: colIndex + 1 })
			}
		} else if (type === 'Array<Number>') {
			try {
				const arr = Array.isArray(value)
					? value
					: value.toString().split(',').map(Number)
				const validArr = arr.filter(n => !isNaN(n)).sort((a, b) => a - b)
				obj[cleanKey] = validArr
			} catch {
				validRow = false
				errors.push({ row: rowIndex, col: colIndex + 1 })
			}
		}
	})

	parentPort.postMessage({ row: validRow ? obj : null, errors })
})