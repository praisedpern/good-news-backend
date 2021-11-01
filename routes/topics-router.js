const topicsRouter = require('express').Router()
const { getTopics } = require('../controllers/get-topics')

topicsRouter.get('/', getTopics)

module.exports = topicsRouter
