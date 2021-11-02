const articlesRouter = require('express').Router()
const { getArticleById } = require('../controllers/articles.controllers')

articlesRouter.get('/:id', getArticleById)

module.exports = articlesRouter 