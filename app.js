const express = require('express')
const app = express()
const apiRouter = require('./routes/api-router')

app.use(express.json())

app.use('/api', apiRouter)

app.get('/', (req, res, next) => {
    res.status(200).send({msg: 'Server online'})
})

module.exports = app