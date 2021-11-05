const articlesRouter = require('express').Router()
const {
    getArticleById,
    patchArticleVotes,
    getArticles,
    getCommentsByArticleId,
    postCommentByArticleId,
} = require('../controllers/articles.controllers')

articlesRouter.get('/:id/comments', getCommentsByArticleId)
articlesRouter.post('/:id/comments', postCommentByArticleId)
articlesRouter.get('/:id', getArticleById)
articlesRouter.patch('/:id', patchArticleVotes)
articlesRouter.get('/', getArticles)

module.exports = articlesRouter
