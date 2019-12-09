const multer = require('multer')
const User = require('../models/User')
const Review = require('../models/Review')

// Define folder for avatar
const avatarPath = multer.diskStorage({
	destination: './public/uploads/avatar',
	filename: async (req, file, cb) => {
		const user = await User.findById(req.params.id)
		if (user.avatar) {
			const currentAvatar = user.avatar
				.split('')
				.splice(21)
				.join('')
			if (currentAvatar !== file.originalname) {
				cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
			} else {
				cb(null, user.avatar)
			}
		}
	}
})

// Define folder for images of review
const imagesReviewPath = multer.diskStorage({
	destination: './public/uploads/reviews',
	filename: async (req, file, cb) => {
		const review = await Review.findById(req.params.id)
		const currentImages = []
		if (review.images.length >= 1) {
			review.images.forEach(image => {
				const currentImage = image
					.split('')
					.splice(21)
					.join('')
				currentImages.push(currentImage)
			})
		}
		if (!currentImages.includes(file.originalname)) {
			cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
		} else {
			review.images.forEach(image => {
				cb(null, image)
			})
		}
	}
})

const newImagesReviewPath = multer.diskStorage({
	destination: './public/uploads/reviews',
	filename: (req, file, cb) => {
		cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
	}
})

// avatar
const avatar = multer({ storage: avatarPath }).single('avatar')

// images
const upload = multer({ storage: imagesReviewPath }).array('images', 5)

const newUpload = multer({ storage: newImagesReviewPath }).array('images', 5)

module.exports = { avatar, upload, newUpload }
