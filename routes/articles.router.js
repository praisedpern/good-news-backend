const articlesRouter = require('express').Router()
const {
    getArticleById,
    patchArticleVotes,
    getArticles,
    getCommentsByArticleId,
    postCommentByArticleId,
} = require('../controllers/articles.controllers')

articlesRouter
    .route('/:id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

articlesRouter.route('/:id').get(getArticleById).patch(patchArticleVotes)

articlesRouter.get('/', getArticles)

module.exports = articlesRouter
