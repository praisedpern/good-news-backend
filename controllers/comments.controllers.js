const { deleteFromComments } = require('../models/comments.models')

exports.deleteComment = ({ params }, res, next) => {
    const { id } = params
    return deleteFromComments(id).then(() => {
        return res.status(204).send()
    })
    .catch(next)
}
