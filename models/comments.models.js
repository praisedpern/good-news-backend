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

exports.deleteFromComments = (id) => {
    const queryStr =
    `
        DELETE FROM comments
        WHERE comment_id = $1
        ;
    `
    return db.query(queryStr, [id])
}