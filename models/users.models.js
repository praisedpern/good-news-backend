const db = require('../db/connection')
const format = require('pg-format')

exports.selectUsernames = () => {
    return db.query('SELECT * FROM users;').then(({ rows }) => {
        return rows.map((row) => {
            return row.username
        })
    })
}

exports.selectUsernameById = (username) => {
    return db
        .query(
            `
    SELECT * FROM users
    WHERE username = $1 
    ;
    `,
            [username]
        )
        .then(({ rows }) => {
            return rows[0]
        })
}
