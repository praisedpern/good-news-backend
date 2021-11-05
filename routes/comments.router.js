const commentsRouter = require('express').Router()
const { deleteComment } = require('../controllers/comments.controllers')

commentsRouter.delete('/:id', deleteComment)

module.exports = commentsRouter