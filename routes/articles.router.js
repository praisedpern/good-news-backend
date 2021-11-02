const articlesRouter = require('express').Router()
const { getArticleById, patchArticleVotes } = require('../controllers/articles.controllers')

articlesRouter.get('/:id', getArticleById)
articlesRouter.patch('/:id', patchArticleVotes)

module.exports = articlesRouter 