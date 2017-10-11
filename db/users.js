const User = require('./init').User

function getUser (username) {
  return new Promise((resolve, reject) => {
    User.findOne({ username: username }, function (err, entry) {
      if (err) {
        return reject(err)
      }
      return resolve(entry)
    })
  })
}

module.exports = {
  getUser: getUser
}
