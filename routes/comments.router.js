const commentsRouter = require('express').Router()
const { deleteComment, patchCommentVotes } = require('../controllers/comments.controllers')

commentsRouter.delete('/:id', deleteComment)
commentsRouter.patch('/:id', patchCommentVotes)

module.exports = commentsRouter