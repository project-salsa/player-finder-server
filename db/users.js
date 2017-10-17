'use strict'

const User = require('./init').User

function createUser (username, password, email) {
  return new Promise((resolve, reject) => {
    if (username === null) {
      return reject(new Error('Error: Username field is null'))
    }
    if (password === null) {
      return reject(new Error('Error: Password field is null'))
    }
    if (email === null) {
      return reject(new Error('Error: Email field is null'))
    }
    const newUser = new User(
      {
        username: username,
        password: password,
        email: email,
        subscribedTags: [],
        notificationTags: [],
        discordId: '',
        steamId: '',
        battleNetId: ''
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
