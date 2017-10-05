'use strict'

const User = require('./init').User

function createUser (username, password, email) {
  return new Promise((resolve, reject) => {
    const newUser = new User(
      {
        username: username,
        password: password,
        email: email
      })

    newUser.save((err, data) => {
      if (err) {
        return reject(new Error(err))
      }

      return resolve(data)
    })
  })
}

module.exports = {
  createUser: createUser
}
