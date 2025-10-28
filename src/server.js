const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./db/mongo');

dotenv.config();

const PORT = process.env.PORT 


connectDB();

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`)
})