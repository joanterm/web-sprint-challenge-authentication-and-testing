const db = require("../../data/dbConfig")

function findBy(filter) {
    return db("users")
    .select("id", "username", "password")
    .where(filter)
}

function findById(id) {
    return db("users")
    .where("id", id)
    .first()
}

function insert(user) {
    return db("users")
    .insert(user)
    .then((ids) => {
        return findById(ids[0])
    })
}

module.exports = {
    findBy,
    insert
}