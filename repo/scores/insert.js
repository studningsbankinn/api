const { flatten, toTuple } = require('pg-parameterize')

function makeInsertScore (db) {
  return (scores) => {
    const tuples = toTuple(scores, true)
    const sql = `
      INSERT INTO scores(
        placeid,
        score,
        date
      )
      VALUES ${tuples}`

    return db
      .query(sql, flatten(scores))
      .then(res => res.rows)
  }
}

module.exports = makeInsertScore