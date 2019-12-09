const { genSaltSync, hashSync, compareSync } = require('bcryptjs')
const fs = require('fs')
const path = require('path')

// Models
const User = require('../models/User')

// JSON response
const successRes = { status: 200, error: false }
const errorRes = { status: 400, error: true }

// Get review
const get = (req, res) => {
	const { id } = req.params

	if (id) {
		User.findById(id)
			.then(result => {
				successRes.message = 'Success to get user'
				successRes.data = result
				res.status(200).json(successRes)
			})
			.catch(error => {
				errorRes.message = 'Failed to get user'
				errorRes.data = error
			})
	} else {
		User.find({ id })
			.then(result => {
				if (result.length < 1) successRes.message = 'User is empty'
				if (result.length >= 1) successRes.message = 'Success to get all user'
				successRes.data = result
				res.status(200).json(successRes)
			})
			.catch(error => {
				errorRes.message = 'Failed to get user'
				errorRes.data = error
			})
	}
}

// Register new user
const register = (req, res) => {
	let { name, username, email, password, password2 } = req.body
	const errors = []

	if (!name) errors.push({ name: 'Name must be filled' })
	if (!username) errors.push({ username: 'Username must be filled' })
	if (!email) errors.push({ email: 'Email must be filled' })
	if (!password) errors.push({ password: 'Password must be filled' })
	if (!password2) errors.push({ password2: 'Password confirm must be filled' })
	if (password !== password2) errors.push({ notMatch: 'Password do not match' })

	if (errors.length < 1) {
		const salt = genSaltSync(10)
		const hash = hashSync(password, salt)
		const data = { name, username, email, password: hash, createdAt: new Date() }

		User.findOne({ email }).then(user => {
			if (user) {
				errorRes.message = 'Failed to register new account'
				errorRes.data = 'Email was registered'
				res.status(400).json(errorRes)
			} else {
				new User(data).save().then(result => {
					successRes.status = 201
					successRes.message = 'Success to register new account'
					successRes.data = result
					res.status(201).json(successRes)
				})
			}
		})
	} else {
		console.log(errors.length)
		errorRes.message = 'Failed to register new account'
		errorRes.data = errors
		res.status(400).json(errorRes)
	}
}

// Login user
const login = (req, res) => {
	const { email, password } = req.body
	const errors = []
	if (!email) errors.push({ email: 'Email must be filled' })
	if (!password) errors.push({ password: 'Password must be filled' })

	if (errors.length < 1) {
		User.findOne({ email }).then(user => {
			if (!user) {
				errorRes.message = 'Failed to login'
				errorRes.data = 'Email not registered yet'
				res.status(400).json(errorRes)
			}

			const isMatch = compareSync(password, user.password)
			if (isMatch) {
				successRes.message = 'Success to login'
				successRes.data = user
				res.status(200).json(successRes)
			} else {
				errorRes.message = 'Password invalid'
				errorRes.data = []
				res.status(400).json(errorRes)
			}
		})
	} else {
		errorRes.message = 'Failed to login'
		errorRes.data = errors
		res.status(400).json(errorRes)
	}
}

// Update review
const update = (req, res) => {
	const { id } = req.params

	User.findById(id).then(user => {
		const { name, username, email, password } = req.body
		const avatar = []
		if (req.file) {
			avatar.push(req.file.filename)
		}

		if (user.avatar) {
			const currentAvatar = user.avatar
				.split('')
				.splice(21)
				.join('')

			const newAvatar = avatar[0]
				.split('')
				.splice(21)
				.join('')
			if (currentAvatar != newAvatar) {
				fs.unlinkSync(path.join(__dirname, '../../public/uploads/avatar/' + user.avatar))
				user.avatar = avatar[0]
			}
		} else {
			if (avatar) user.avatar = avatar[0]
		}

		if (name) user.name = name
		if (username) user.username = username
		if (email) user.email = email
		if (password) {
			const salt = genSaltSync(10)
			const hash = hashSync(password, salt)
			user.password = hash
		}

		user.save()
			.then(result => {
				successRes.message = 'Success to update user with ID ' + id
				successRes.data = result
				res.status(200).json(successRes)
			})
			.catch(error => {
				errorRes.message = 'Failed to update user with ID ' + id
				errorRes.data = error
				res.status(200).json(errorRes)
			})
	})
}

// Delete review
const destroy = (req, res) => {
	const { id } = req.params

	User.findByIdAndRemove(id)
		.then(result => {
			if (result) {
				fs.unlinkSync(path.join(__dirname, '../../public/uploads/avatar/' + result.avatar))
				successRes.message = 'Success to delete user with ID ' + id
				successRes.data = result
				res.status(200).json(successRes)
			} else {
				successRes.status = 404
				successRes.error = true
				successRes.message = 'User not found'
				res.status(404).json(successRes)
			}
		})
		.catch(error => {
			errorRes.message = 'Failed to delete user with ID ' + id
			errorRes.data = error
			res.status(400).json(errorRes)
		})
}

module.exports = { get, register, login, update, destroy }
