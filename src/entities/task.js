function buildMakeTask({ Id }) {
	return function makeTask({
		id = Id.makeId(),
		fileName,
		mapping,
		status = 'pending',
		startedOn = null,
		finishedOn = null,
		createdOn = Date.now(),
		result = null,
		errors = [],
	} = {}) {
		if (!Id.isValidId(id)) {
			throw new Error('Task must have a valid id.')
		}

		if (!fileName || typeof fileName !== 'string' || fileName.trim().length < 1) {
			throw new Error('Task must have a valid file name.')
		}

		const validStatuses = ['pending', 'processing', 'done']
		if (!validStatuses.includes(status)) {
			throw new Error(`Task status must be one of: ${validStatuses.join(', ')}`)
		}

		if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) {
			throw new Error('Task must have a valid mapping object.')
		}

		const allowedTypes = ['String', 'Number', 'Array<Number>']
		for (const key in mapping) {
			const type = mapping[key]
			if (!allowedTypes.includes(type)) {
				throw new Error(
					`Invalid mapping type for "${key}". Allowed types: ${allowedTypes.join(', ')}`
				)
			}
		}

		return Object.freeze({
			getId: () => id,
			getFileName: () => fileName,
			getMapping: () => mapping,
			getStatus: () => status,
			getStartedOn: () => startedOn,
			getFinishedOn: () => finishedOn,
			getCreatedOn: () => createdOn,
			getResult: () => result,
			getErrors: () => errors,

			markProcessing: () => {
				if (status !== 'pending') {
					throw new Error(`Cannot mark task as processing from status "${status}".`)
				}
				status = 'processing'
				startedOn = Date.now()
			},

			markDone : (resultData, errorsData) => {
				if (status !== 'processing') {
					throw new Error(`Cannot mark task as done from status "${status}".`)
				}
      
				if (resultData == null){
					throw new Error('No data was passed, expected at least an empty array')
				}

				if (errorsData == null){
					throw new Error('No errors were passed, expected at least an empty array')
				}

				status = 'done'
				result = resultData
				errors = errorsData
				finishedOn = Date.now()
			}
		})

	}
}

module.exports = buildMakeTask