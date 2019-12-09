const fs = require('fs')
const path = require('path')

// Models
const Review = require('../models/Review')

const successRes = { status: 200, error: false }
const errorRes = { status: 400, error: true }

// Get review
const get = (req, res) => {
	const { id } = req.params

	if (id) {
		Review.findById(id)
			.populate('userId')
			.then(result => {
				successRes.message = 'Success to get review'
				successRes.data = result
				res.status(200).json(successRes)
			})
			.catch(error => {
				errorRes.message = 'Failed to get review'
				errorRes.data = error
			})
	} else {
		Review.find()
			.populate('userId')
			.then(result => {
				if (result.length < 1) successRes.message = 'Review is empty'
				if (result.length > 1) successRes.message = 'Success to get all review'
				successRes.data = result
				res.status(200).json(successRes)
			})
			.catch(error => {
				errorRes.message = 'Failed to get review'
				errorRes.data = error
			})
	}
}

// Addd review
const add = (req, res) => {
	const { userId } = req.params
	const { text, rating } = req.body
	const images = []
	const errors = []

	if (!text) errors.push({ text: 'Text must be filled' })

	if (req.files) {
		req.files.forEach(v => images.push(v.filename))
	}

	const data = { userId, text, images, rating }
	console.log(data.images)

	if (errors.length < 1) {
		new Review(data).save().then(review => {
			successRes.status = 201
			successRes.message = 'Success to add review'
			successRes.data = review
			res.status(201).json(successRes)
		})
	} else {
		errorRes.message = 'Failed to add review'
		errorRes.data = errors
		res.status(400).json(errorRes)
	}
}

// Update review
const update = (req, res) => {
	const { id } = req.params

	Review.findById(id).then(review => {
		const { text, rating } = req.body
		const images = []

		if (req.files) {
			req.files.forEach(v => images.push(v.filename))
		}

		if (review.images.length >= 1) {
			const currentImages = []
			review.images.forEach(image => {
				const currentImage = image
					.split('')
					.splice(21)
					.join('')
				currentImages.push(currentImage)
			})
			images.forEach(image => {
				const newImage = image
					.split('')
					.splice(21)
					.join('')

				if (!currentImages.includes(newImage)) {
					review.images.push(image)
				}
			})
		} else {
			if (images.length >= 1) review.images = images
		}

		if (text) review.text = text
		if (rating) review.rating = rating

		review
			.save()
			.then(result => {
				successRes.message = 'Success to update review with ID ' + id
				successRes.data = result
				res.status(200).json(successRes)
			})
			.catch(error => {
				errorRes.message = 'Failed to update review with ID ' + id
				errorRes.data = error
				res.status(200).json(errorRes)
			})
	})
}

// Delete review
const destroy = (req, res) => {
	const { id } = req.params
	Review.findByIdAndRemove(id)
		.then(result => {
			if (result) {
				result.images.forEach(image => fs.unlinkSync(path.join(__dirname, `../../public/uploads/reviews/${image}`)))
				successRes.message = 'Success to delete review with ID ' + id
				successRes.data = result
				res.status(200).json(successRes)
			} else {
				successRes.status = 404
				successRes.error = true
				successRes.message = 'Review not found'
				res.status(404).json(successRes)
			}
		})
		.catch(error => {
			errorRes.message = 'Failed to delete review with ID ' + id
			errorRes.data = error
			res.status(400).json(errorRes)
		})
}

module.exports = { get, add, update, destroy }
