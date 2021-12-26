const {
    selectUsernames,
    selectUsernameById,
} = require('../models/users.models')

exports.getUsers = (req, res, next) => {
    selectUsernames().then((result) => {
        res.status(200).send(result)
    })
}

exports.getUserById = ({ params }, res, next) => {
    const { id } = params
    selectUsernameById(id).then((result) => {
        res.status(200).send(result)
    })
}
