const { selectUsernames } = require('../models/users.models')

exports.getUsers = (req, res, next) => {
    selectUsernames().then((result) => {
        const response = result.map((row) => {
            return { username: row }
        })
        res.status(200).send(response)
    })
}
