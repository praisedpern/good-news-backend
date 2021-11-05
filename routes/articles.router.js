const articlesRouter = require('express').Router()
const {
    getArticleById,
    patchArticleVotes,
    getArticles,
    getArticleComments,
} = require('../controllers/articles.controllers')

articlesRouter.get('/:id/comments', getArticleComments)
articlesRouter.get('/:id', getArticleById)
articlesRouter.patch('/:id', patchArticleVotes)
articlesRouter.get('/', getArticles)

module.exports = articlesRouter
