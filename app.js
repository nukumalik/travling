const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

// Main App
const app = express()

// Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Database
mongoose.Promise = global.Promise
mongoose
	.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err))

// Index
app.get('/', (req, res) => {
	res.send('Welcome to simple CRUD Review API, the routes are /users and /reviews')
})

// Routes
app.use(require('./src/config/routes'))

// Port
const port = process.env.PORT || 3000

// Connect to server
app.listen(port, () => console.log('Server is running on port ' + port))
