const app = require('./app')
const dotenv = require('dotenv')
const connectDB = require('./gateways/mongo')

dotenv.config()
const PORT = process.env.PORT

connectDB()
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})