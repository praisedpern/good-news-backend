const express = require('express')
const app = express()
const apiRouter = require('./routes/api.router')
const {handleCustomErrors, handleServerErrors, handlePsqlErrors} = require('./errors')
const authCheck = require('./utils/auth-check')

app.use(express.json())

app.use('/*', authCheck)

app.use('/api', apiRouter)

app.get('/', (req, res, next) => {
    res.status(200).send({ msg: 'Server online' })
})

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app
