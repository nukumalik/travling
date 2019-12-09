const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Review Schema
const reviewSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	text: {
		type: String,
		required: true
	},
	images: [String],
	rating: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	}
})

reviewSchema.pre('create', () => {
	if (!this.createdAt) this.createdAt = new Date()
})

const Review = mongoose.model('reviews', reviewSchema)

module.exports = Review
