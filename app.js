const express = require('express')
const app = express()
const apiRouter = require('./routes/api-router')

app.use(express.json())

app.use('/api', apiRouter)

app.get('/', (req, res, next) => {
    res.status(200).send({ msg: 'Server online' })
})

// custom errors
app.use((err, req, res, next)=> {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
})

// 500 internal server error
app.use((err, req, res, next) => {
    console.log({unhandled_error: err})
    res.status(500).send({ msg: 'Internal server error' })
})

module.exports = app
