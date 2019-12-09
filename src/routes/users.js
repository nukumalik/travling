const router = require('express').Router()
const { avatar } = require('../helpers/multer')

// Controller
const users = require('../controllers/users')

router
	.get('/:id', users.get)
	.get('/', users.get)
	.post('/login', users.login)
	.post('/register', users.register)
	.patch('/:id', avatar, users.update)
	.delete('/:id', users.destroy)

module.exports = router
