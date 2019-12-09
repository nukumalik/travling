const router = require('express').Router()

// API routes
router.use('/reviews', require('../routes/reviews')).use('/users', require('../routes/users'))

module.exports = router
