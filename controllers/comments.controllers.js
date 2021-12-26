const {
    deleteFromComments,
    updateCommentVotes,
} = require('../models/comments.models')

exports.deleteComment = ({ params }, res, next) => {
    const { id } = params
    return deleteFromComments(id)
        .then(() => {
            return res.status(204).send()
        })
        .catch(next)
}

exports.patchCommentVotes = ({ params, body }, res, next) => {
    const { id } = params
    const { inc_votes } = body
    return updateCommentVotes(id, inc_votes)
        .then((result) => {
            return res.status(200).send({ comment: result })
        })
        .catch(next)
}
