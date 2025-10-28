module.exports = function makeExpressCallback(controller) {

	return async (req, res) => {
		const httpRequest = {
			body: req.body,
			query: req.query,
			params: req.params,
			ip: req.ip,
			method: req.method,
			path: req.path,
			headers: req.headers
		}

		try {
			const httpResponse = await controller(httpRequest)

			if (httpResponse.headers) {
				res.set(httpResponse.headers)
			}

			res.type('json')
			res.status(httpResponse.statusCode).send(httpResponse.body)
		} catch (err) {
			const status = err.status || 500
			res.status(status).json({
				status,
				error: status === 403 ? 'Forbidden' : 'Internal Server Error',
				message: err.message,
				code: err.code || 'INTERNAL_ERROR',
				timestamp: Date.now()
			})
		}
	}
}