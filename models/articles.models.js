const db = require('../db/connection')

exports.selectArticleById = (id) => {
    let queryStr = `SELECT * FROM articles`
    if (typeof id === 'number') queryStr += ` WHERE article_id = ${id}`
    return db.query(queryStr).then((result)=>{
        return result
    })
}