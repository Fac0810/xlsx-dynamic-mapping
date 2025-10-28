const dotenv = require('dotenv')
dotenv.config()

function apiKeyAuth(req, res, next) {

	if (req.path.startsWith('/api-docs')) return next()
	const apiKey = req.headers['x-api-key']
	if (!apiKey || apiKey !== process.env.API_KEY) {
		return res.status(403).json({
			error: 'Forbidden: Missing or invalid API key.',
			code: 'AUTH_INVALID_KEY'
		})
	}
	next()
}

module.exports = apiKeyAuth