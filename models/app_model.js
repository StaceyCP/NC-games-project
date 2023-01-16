const db = require('../db/connection')

const fetchCategories = () => {
    const getCategoriesStr = `SELECT * FROM categories`
    return db.query(getCategoriesStr).then((result) => {
        return result.rows
    })
}

module.exports = { fetchCategories }