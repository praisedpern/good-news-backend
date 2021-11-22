const apiRouter = require('express').Router()
const topicsRouter = require('./topics.router')
const articlesRouter = require('./articles.router')
const commentsRouter = require('./comments.router')
const apiObject = require('../endpoints.json')
const usersRouter = require('./users.router')

apiRouter.get('/', (req, res, next) => {
    res.status(200).send(apiObject)
})

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter