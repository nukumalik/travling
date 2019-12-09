const router = require('express').Router()
const { upload, newUpload } = require('../helpers/multer')

// Controller
const reviews = require('../controllers/reviews')

router
	.get('/:id', reviews.get)
	.get('/', reviews.get)
	.post('/:userId', newUpload, reviews.add)
	.patch('/:id', upload, reviews.update)
	.delete('/:id', reviews.destroy)

module.exports = router
