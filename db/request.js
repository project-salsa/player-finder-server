const Request = require('./init').Request
const User = require('./init').User

function getRequestsByUser (username) {
  return new Promise((resolve, reject) => {
    Request.find().populate({
      path: 'user',
      match: { username: username }
    }).then((data) => {
      return resolve(data)
    }, (err) => {
      return reject(err)
    }).catch((err) => {
      return reject(err)
    })
  })

}

module.exports = {
  getRequestsByUser: getRequestsByUser
}