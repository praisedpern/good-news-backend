const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then(({ rows }) => {
        return rows
    })
}

exports.selectTopicSlugs = () => {
    return db.query('SELECT slug FROM topics').then(({ rows }) => {
        return rows.map(row => {
            return row.slug
        })
    })
}
