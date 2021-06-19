const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const companion = require('@uppy/companion')
const app = require('express')()
require('dotenv').config()

const DATA_DIR = path.join(__dirname, 'tmp')

app.use(require('cors')({
	origin: true,
	credentials: true,
}))
app.use(require('cookie-parser')())
app.use(require('body-parser').json())
app.use(require('express-session')({
	secret: 'Hello Human!',
}))

const options = {
	providerOptions: {
		drive: {
			key: process.env.GOOGLE_DRIVE_KEY,
			secret: process.env.GOOGLE_DRIVE_SECRET,
		},
		s3: {
			getKey: (req, filename) => {
				return `whatever/${filename}`;
			},
			key: process.env.AWS_KEY,
			secret: process.env.AWS_SECRETE,
			bucket: process.env.AWS_S3_BUCKET_NAME,
		},
	},
	server: {
		host: 'localhost:3020'
	},
	filePath: DATA_DIR,
	secret: 'random_key',
	debug: true,
}

// Create the data directory here for the sake of the example.
try {
	fs.accessSync(DATA_DIR)
} catch (err) {
	fs.mkdirSync(DATA_DIR)
}
process.on('exit', () => {
	rimraf.sync(DATA_DIR)
})
app.use(companion.app(options))
const server = app.listen(3020, () => {
	console.log('listening on port 3020')
})

companion.socket(server, options)