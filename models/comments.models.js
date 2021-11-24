const db = require('../db/connection')
const format = require('pg-format')

exports.selectArticleComments = (articleId) => {
    return db
        .query(
            `
        SELECT
        comment_id, votes, created_at, author, body
        FROM comments
        WHERE article_id = $1
        ;
    `,
            [articleId]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No comments found for article: ${articleId}`,
                })
            }
            return rows
        })
}
exports.insertIntoComments = (articleId, body, validUsernames) => {
    let queryStr = format(
        `
        INSERT INTO comments
        (author, article_id, body)
        VALUES (%L)
        RETURNING *
        ;
    `,
        [body.username, articleId, body.body]
    )
    return db.query(queryStr).then((result) => {
        return result.rows[0]
    })
}

exports.deleteFromComments = (commentId) => {
    const queryStr =
    `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *
        ;
    `
    return db.query(queryStr, [commentId]).then(({rows})=> {
        if (rows[0] === undefined) {
            return Promise.reject({
                status: 404,
                msg: `No comments found with ID: ${commentId}`,
            })
        }
        return
    })
}

exports.updateCommentVotes = (id, votes) => {
    const queryStr =
    `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *
        ;
    `
    return db.query(queryStr, [votes, id]).then(({rows})=> {
        if (rows[0] === undefined) {
            return Promise.reject({
                status: 404,
                msg: `No comments found with ID: ${commentId}`,
            })
        }
        return rows[0]
    })
}