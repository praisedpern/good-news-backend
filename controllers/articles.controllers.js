const {
    selectArticleById,
    updateArticleVotes,
    selectArticles,
} = require('../models/articles.models')

const { selectTopicSlugs } = require('../models/topics.models')

const {
    selectArticleComments,
    insertIntoComments,
} = require('../models/comments.models')

const { selectUsernames } = require('../models/users.models')

exports.getArticleById = ({ params }, res, next) => {
    const id = params.id
    return selectArticleById(id)
        .then((result) => {
            return res.status(200).send({ article: result })
        })
        .catch(next)
}

exports.patchArticleVotes = ({ params, body }, res, next) => {
    const id = params.id
    const votes = body.inc_votes
    return updateArticleVotes(id, votes)
        .then(() => {
            return selectArticleById(id).then((result) => {
                return res.status(202).send({ article: result })
            })
        })
        .catch(next)
}

exports.getArticles = (req, res, next) => {
    return selectTopicSlugs()
        .then((validTopics) => {
            const { sort_by, order, topic } = req.query
            return selectArticles(sort_by, order, topic, validTopics).then(
                (result) => {
                    return res.status(200).send({ articles: result })
                }
            )
        })
        .catch(next)
}

exports.getCommentsByArticleId = ({ params }, res, next) => {
    const { id } = params
    return selectArticleComments(id)
        .then((result) => {
            return res.status(200).send({ comments: result })
        })
        .catch(next)
}

exports.postCommentByArticleId = ({ params, body }, res, next) => {
    // return selectUsernames().then((validUsernames) => {
        const { id } = params
        return insertIntoComments(id, body).then((result) => {
            return res.status(201).send({ comment: result })
        })
    // })
}
