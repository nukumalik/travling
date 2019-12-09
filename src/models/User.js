const mongoose = require('mongoose')
const Schema = mongoose.Schema

// User Schema
const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	avatar: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	}
})

userSchema.pre('create', () => {
	if (this.createdAt) this.createdAt = new Date()
})

const User = mongoose.model('users', userSchema)

module.exports = User
