const articlesRouter = require('express').Router()
const { getArticleById, patchArticleVotes, getArticles } = require('../controllers/articles.controllers')

articlesRouter.get('/:id', getArticleById)
articlesRouter.patch('/:id', patchArticleVotes)
articlesRouter.get('/', getArticles)

module.exports = articlesRouter 