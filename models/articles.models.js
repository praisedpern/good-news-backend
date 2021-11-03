const db = require('../db/connection')


exports.selectArticleById = (id) => {
    let queryStr = `
        SELECT articles.*, COUNT(comments.author)
        AS comment_count
        FROM articles
        LEFT JOIN comments AS comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `
    return db.query(queryStr, [id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `ID not found: ${id}`,
            })
        }
        rows[0].comment_count = parseInt(rows[0].comment_count)
        return rows[0] 
    })
}

exports.updateArticleVotes = (id, votes) => {
    // if (!id.match(/^\d+$/)) {
    //     return Promise.reject({
    //         status: 400,
    //         msg: `Invalid ID: ${id}`,
    //     })
    // }

    let queryStr = `
        UPDATE articles
        SET votes = votes + $1
        WHERE articles.article_id = $2
        RETURNING *;
    `
    return db.query(queryStr, [votes, id]).then((result)=> {
        return result
    })
}
